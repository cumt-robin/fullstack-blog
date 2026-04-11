import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from "./auth.constants";

type RequestLike = {
    headers: Record<string, string | string[] | undefined>;
};

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    extractToken(authorization: string = ""): string | undefined {
        const [type, token] = authorization.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }

    extractTokenFromCookie(cookieHeader: string = ""): string | undefined {
        if (!cookieHeader) {
            return undefined;
        }

        const cookies = cookieHeader.split(";").map((item) => item.trim());
        const matched = cookies.find((item) => item.startsWith(`${AUTH_COOKIE_NAME}=`));
        if (!matched) {
            return undefined;
        }

        const value = matched.slice(`${AUTH_COOKIE_NAME}=`.length);
        return value ? decodeURIComponent(value) : undefined;
    }

    extractTokenFromRequest(request: RequestLike): string | undefined {
        const authorizationHeader = request.headers.authorization;
        const authorization = Array.isArray(authorizationHeader) ? authorizationHeader[0] || "" : authorizationHeader || "";
        const headerToken = this.extractToken(authorization);
        if (headerToken) {
            return headerToken;
        }

        const cookieHeader = request.headers.cookie;
        const cookie = Array.isArray(cookieHeader) ? cookieHeader.join("; ") : cookieHeader || "";
        return this.extractTokenFromCookie(cookie);
    }

    getCookieName(): string {
        return AUTH_COOKIE_NAME;
    }

    getCookieOptions() {
        return {
            httpOnly: true,
            sameSite: "lax" as const,
            secure: this.configService.get("NODE_ENV") === "production",
            path: "/",
            maxAge: AUTH_COOKIE_MAX_AGE,
        };
    }

    async sign(payload: string | object | Buffer) {
        if (typeof payload === "string") {
            return this.jwtService.signAsync(payload);
        }
        return this.jwtService.signAsync(payload);
    }

    async verify(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("JWT_SECRET"),
        });
    }

    async verifyIgnoreExpiration(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("JWT_SECRET"),
            ignoreExpiration: true,
        });
    }

    async getCurrentUser(authorization: string | undefined) {
        if (!authorization) {
            throw new ForbiddenException("请先登录");
        }

        const token = this.extractToken(authorization);
        if (!token) {
            throw new ForbiddenException("请先登录");
        }

        return this.verify(token);
    }

    async getCurrentUserFromRequest(request: RequestLike) {
        const token = this.extractTokenFromRequest(request);
        if (!token) {
            throw new ForbiddenException("请先登录");
        }
        return this.verify(token);
    }
}
