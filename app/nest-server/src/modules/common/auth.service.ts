import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

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

    async sign(payload: any) {
        const result = await this.jwtService.signAsync(payload);
        return result;
    }

    async verify(token: string) {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get("JWT_SECRET"),
        });
        return payload;
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
}
