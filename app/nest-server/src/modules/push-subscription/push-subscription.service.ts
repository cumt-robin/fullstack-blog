import { PushSubscription } from "@/entities/PushSubscription";
import { AuthService } from "@/modules/common/auth.service";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as webpush from "web-push";
import { Repository } from "typeorm";
import { SubscribePushDto } from "./dto/push-subscription.dto";
import { Request } from "express";

export type PushEventType = "article_created" | "article_updated";

export interface PushArticlePayload {
    eventType: PushEventType;
    articleId: number;
    title: string;
    summary: string;
}

interface PushNotificationPayload {
    title: string;
    body: string;
    url: string;
    icon: string;
    tag: string;
    eventType: PushEventType;
    articleId: number;
}

@Injectable()
export class PushSubscriptionService {
    private readonly logger = new Logger(PushSubscriptionService.name);
    private readonly isWebPushConfigured: boolean;

    constructor(
        @InjectRepository(PushSubscription) private readonly pushSubscriptionRepository: Repository<PushSubscription>,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
        const publicKey = this.configService.get<string>("WEB_PUSH_VAPID_PUBLIC_KEY");
        const privateKey = this.configService.get<string>("WEB_PUSH_VAPID_PRIVATE_KEY");
        const contactEmail = this.configService.get<string>("WEB_PUSH_CONTACT_EMAIL");

        if (publicKey && privateKey && contactEmail) {
            webpush.setVapidDetails(`mailto:${contactEmail}`, publicKey, privateKey);
            this.isWebPushConfigured = true;
            return;
        }

        this.isWebPushConfigured = false;
        this.logger.warn("Web Push VAPID env is missing. Push delivery is disabled.");
    }

    private async getOptionalUserId(request: Request): Promise<number | null> {
        const token = this.authService.extractTokenFromRequest(request);
        if (!token) {
            return null;
        }
        try {
            const payload = await this.authService.verify(token);
            return payload?.id ?? null;
        } catch (error) {
            this.logger.warn(`Ignore invalid token when subscribing push: ${(error as Error).message}`);
            return null;
        }
    }

    async subscribe(body: SubscribePushDto, request: Request, deviceId: string) {
        const userId = await this.getOptionalUserId(request);
        const payload = {
            endpoint: body.endpoint,
            p256dh: body.p256dh,
            auth: body.auth,
            user_agent: body.userAgent || null,
            user_id: userId,
            device_id: deviceId,
            status: 1 as 0 | 1,
            error_reason: null,
            last_error_at: null,
        };

        const existed = await this.pushSubscriptionRepository.findOne({
            where: { endpoint: body.endpoint },
            select: ["id"],
        });

        if (existed?.id) {
            await this.pushSubscriptionRepository.update(existed.id, payload);
        } else {
            await this.pushSubscriptionRepository.delete({
                device_id: deviceId,
            });
            await this.pushSubscriptionRepository.insert(payload);
        }

        return {};
    }

    async unsubscribe(endpoint: string) {
        await this.pushSubscriptionRepository.update(
            { endpoint },
            {
                status: 0,
                user_id: null,
                last_error_at: new Date(),
                error_reason: "manual_unsubscribe",
            },
        );
        return {};
    }

    async unbindByDevice(deviceId: string, endpoint?: string) {
        if (endpoint) {
            await this.pushSubscriptionRepository.update(
                {
                    device_id: deviceId,
                    endpoint,
                },
                {
                    user_id: null,
                },
            );
            return {};
        }

        await this.pushSubscriptionRepository.update(
            {
                device_id: deviceId,
            },
            {
                user_id: null,
            },
        );
        return {};
    }

    async adminPage(pageNo: number, pageSize: number, status?: 0 | 1) {
        const [data, total] = await this.pushSubscriptionRepository.findAndCount({
            where: status === undefined ? {} : { status },
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            order: {
                update_time: "DESC",
            },
            select: [
                "id",
                "endpoint",
                "status",
                "user_id",
                "device_id",
                "user_agent",
                "last_success_at",
                "last_error_at",
                "error_reason",
                "create_time",
                "update_time",
            ],
        });
        return {
            data,
            total,
        };
    }

    private toNotificationPayload(payload: PushArticlePayload): PushNotificationPayload {
        const title = payload.eventType === "article_created" ? `�����·�����${payload.title}` : `�����Ѹ��£�${payload.title}`;
        const body = payload.summary || "����鿴��������";
        return {
            title,
            body,
            url: `/article/${payload.articleId}`,
            icon: "/pwa-192x192.png",
            tag: `article-${payload.articleId}-${payload.eventType}`,
            eventType: payload.eventType,
            articleId: payload.articleId,
        };
    }

    private shouldRetry(error: unknown): boolean {
        const statusCode = (error as { statusCode?: number })?.statusCode;
        return statusCode === 429 || (statusCode !== undefined && statusCode >= 500 && statusCode < 600);
    }

    private async sendWithRetry(target: PushSubscription, payload: string): Promise<void> {
        try {
            await webpush.sendNotification(
                {
                    endpoint: target.endpoint,
                    keys: {
                        p256dh: target.p256dh,
                        auth: target.auth,
                    },
                },
                payload,
            );
            await this.pushSubscriptionRepository.update(
                { id: target.id },
                {
                    last_success_at: new Date(),
                    last_error_at: null,
                    error_reason: null,
                    status: 1,
                },
            );
        } catch (error) {
            const statusCode = (error as { statusCode?: number })?.statusCode;
            if (statusCode === 404 || statusCode === 410) {
                await this.pushSubscriptionRepository.update(
                    { id: target.id },
                    {
                        status: 0,
                        last_error_at: new Date(),
                        error_reason: `invalid_endpoint_${statusCode}`,
                    },
                );
                return;
            }

            if (this.shouldRetry(error)) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                try {
                    await webpush.sendNotification(
                        {
                            endpoint: target.endpoint,
                            keys: {
                                p256dh: target.p256dh,
                                auth: target.auth,
                            },
                        },
                        payload,
                    );
                    await this.pushSubscriptionRepository.update(
                        { id: target.id },
                        {
                            last_success_at: new Date(),
                            last_error_at: null,
                            error_reason: null,
                            status: 1,
                        },
                    );
                    return;
                } catch (retryError) {
                    this.logger.warn(`Retry send push failed: ${(retryError as Error).message}`);
                    await this.pushSubscriptionRepository.update(
                        { id: target.id },
                        {
                            last_error_at: new Date(),
                            error_reason: `retry_failed_${(retryError as { statusCode?: number })?.statusCode || "unknown"}`,
                        },
                    );
                    return;
                }
            }

            await this.pushSubscriptionRepository.update(
                { id: target.id },
                {
                    last_error_at: new Date(),
                    error_reason: `send_failed_${statusCode || "unknown"}`,
                },
            );
        }
    }

    async pushArticle(payload: PushArticlePayload) {
        if (!this.isWebPushConfigured) {
            return;
        }
        const targets = await this.pushSubscriptionRepository.find({
            where: { status: 1 },
            select: ["id", "endpoint", "p256dh", "auth"],
        });
        if (targets.length === 0) {
            return;
        }

        const notificationPayload = JSON.stringify(this.toNotificationPayload(payload));
        await Promise.allSettled(targets.map((target) => this.sendWithRetry(target, notificationPayload)));
    }
}
