import { PUBLIC_ACCESS_KEY } from "@/decorators/public-access.decorator";
import { InnerException } from "@/exceptions/inner.exception";
import { AuthService } from "@/modules/common/auth.service";
import { CanActivate, Injectable } from "@nestjs/common";

import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TokenExpiredError } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ACCESS_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.authService.extractToken(request.headers.authorization);
        if (!token) {
            throw new InnerException("000001", "对不起，您还未获得授权");
        }

        try {
            const payload = await this.authService.verify(token);
            request["currentUser"] = payload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.error(error);
            if (error instanceof TokenExpiredError) {
                throw new InnerException("000002", "授权已过期");
            }
            throw new InnerException("000004", "授权验证失败");
        }

        return true;
    }
}
