import { PUBLIC_ACCESS_KEY } from "@/decorators/public-access.decorator";
import { InnerException } from "@/exceptions/inner.exception";
import { AuthService } from "@/modules/common/auth.service";
import { UserSessionService } from "@/modules/user-session/user-session.service";
import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TokenExpiredError } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(
        private readonly authService: AuthService,
        private readonly reflector: Reflector,
        private readonly userSessionService: UserSessionService,
    ) {}

    private getDeviceId(request: { headers: Record<string, string | string[] | undefined> }) {
        const headerValue = request.headers["x-device-id"];
        if (Array.isArray(headerValue)) {
            return headerValue[0] || "";
        }
        return headerValue || "";
    }

    private async safeInvalidateByDevice(deviceId: string) {
        if (!deviceId) {
            return;
        }
        try {
            await this.userSessionService.invalidateByDevice(deviceId);
        } catch (error) {
            this.logger.warn(`Failed to invalidate session by device: ${(error as Error).message}`);
        }
    }

    private async safeInvalidateByUserAndDevice(userId: number | null, deviceId: string) {
        if (!userId || !deviceId) {
            return;
        }
        try {
            await this.userSessionService.invalidateByUserAndDevice(userId, deviceId);
        } catch (error) {
            this.logger.warn(`Failed to invalidate session by user+device: ${(error as Error).message}`);
        }
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ACCESS_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const deviceId = this.getDeviceId(request);
        const token = this.authService.extractToken(request.headers.authorization);

        if (!token) {
            await this.safeInvalidateByDevice(deviceId);
            throw new InnerException("000001", "对不起，您还未获得授权");
        }

        try {
            const payload = await this.authService.verify(token);
            request.currentUser = payload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                let userId: number | null = null;
                try {
                    const payload = await this.authService.verifyIgnoreExpiration(token);
                    userId = payload?.id ?? null;
                } catch (parseError) {
                    this.logger.warn(`Failed to parse expired token payload: ${(parseError as Error).message}`);
                }
                await this.safeInvalidateByUserAndDevice(userId, deviceId);
                throw new InnerException("000002", "授权已过期");
            }

            await this.safeInvalidateByDevice(deviceId);
            let userId: number | null = null;
            try {
                const payload = await this.authService.verifyIgnoreExpiration(token);
                userId = payload?.id ?? null;
            } catch (parseError) {
                this.logger.warn(`Failed to parse token payload on verify failure: ${(parseError as Error).message}`);
            }
            await this.safeInvalidateByUserAndDevice(userId, deviceId);
            throw new InnerException("000004", "授权验证失败");
        }

        return true;
    }
}
