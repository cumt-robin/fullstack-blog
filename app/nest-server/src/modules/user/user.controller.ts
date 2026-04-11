import { PublicAccess } from "@/decorators/public-access.decorator";
import { Body, Controller, Get, Put, Req, Res } from "@nestjs/common";
import { InnerException } from "@/exceptions/inner.exception";
import { Request, Response } from "express";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "./user.service";
import { AuthService } from "../common/auth.service";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    private getDeviceId(req: Request) {
        const headerValue = req.headers["x-device-id"];
        const normalized = Array.isArray(headerValue) ? headerValue[0] || "" : headerValue || "";
        if (!normalized) {
            throw new InnerException("000005", "device_id missing");
        }
        return normalized;
    }

    @PublicAccess()
    @Put("/login")
    async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const sessionCaptcha = req.session.captcha;
        const result = await this.userService.login(loginDto, sessionCaptcha, this.getDeviceId(req));
        res.cookie(this.authService.getCookieName(), result.data.token, this.authService.getCookieOptions());
        return result;
    }

    @Put("/logout")
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const result = await this.userService.logout(req.currentUser.id, this.getDeviceId(req));
        res.clearCookie(this.authService.getCookieName(), {
            ...this.authService.getCookieOptions(),
            maxAge: undefined,
        });
        return result;
    }

    @Get("/current")
    current(@Req() req: Request) {
        return {
            data: req.currentUser,
        };
    }
}
