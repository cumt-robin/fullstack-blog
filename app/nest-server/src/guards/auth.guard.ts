import { PUBLIC_ACCESS_KEY } from "@/decorators/public-access.decorator";
import { InnerException } from "@/exceptions/inner.exception";
import { AuthService } from "@/modules/auth/auth.service";
import { CanActivate, Injectable } from "@nestjs/common";

import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

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
            throw new InnerException("000001", "对不起，您还未获得授权");
        }

        return true;
    }
}