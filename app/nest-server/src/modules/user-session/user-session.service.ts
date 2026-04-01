import { UserSession } from "@/entities/UserSession";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserSessionService {
    constructor(@InjectRepository(UserSession) private readonly userSessionRepository: Repository<UserSession>) {}

    async bindSession(userId: number, deviceId: string) {
        const now = new Date();

        const existed = await this.userSessionRepository.findOne({
            where: {
                user_id: userId,
                device_id: deviceId,
            },
            select: ["id"],
            order: {
                id: "DESC",
            },
        });

        if (existed?.id) {
            await this.userSessionRepository.update(existed.id, {
                status: 1,
                login_at: now,
                logout_at: null,
                last_seen_at: now,
            });
            return;
        }

        await this.userSessionRepository.insert({
            user_id: userId,
            device_id: deviceId,
            status: 1,
            login_at: now,
            logout_at: null,
            last_seen_at: now,
        });
    }

    async invalidateByUserAndDevice(userId: number, deviceId: string) {
        await this.userSessionRepository.update(
            {
                user_id: userId,
                device_id: deviceId,
                status: 1,
            },
            {
                status: 0,
                logout_at: new Date(),
            },
        );
    }

    async invalidateByDevice(deviceId: string) {
        await this.userSessionRepository.update(
            {
                device_id: deviceId,
                status: 1,
            },
            {
                status: 0,
                logout_at: new Date(),
            },
        );
    }
}
