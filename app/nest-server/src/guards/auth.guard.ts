import { PUBLIC_ACCESS_KEY } from "@/decorators/public-access.decorator";
import { InnerException } from "@/exceptions/inner.exception";
import { CanActivate, Injectable } from "@nestjs/common";

import { ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ACCESS_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new InnerException("000001", "对不起，您还未获得授权");
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get("JWT_SECRET"),
            });
            request["currentUser"] = payload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new InnerException("000001", "对不起，您还未获得授权");
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
