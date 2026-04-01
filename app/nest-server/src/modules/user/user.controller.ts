import { PublicAccess } from "@/decorators/public-access.decorator";
import { Body, Controller, Get, Put, Req } from "@nestjs/common";
import { InnerException } from "@/exceptions/inner.exception";
import { Request } from "express";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

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
    login(@Body() loginDto: LoginDto, @Req() req: Request) {
        const sessionCaptcha = req.session.captcha;
        return this.userService.login(loginDto, sessionCaptcha, this.getDeviceId(req));
    }

    @Put("/logout")
    logout(@Req() req: Request) {
        return this.userService.logout(req.currentUser.id, this.getDeviceId(req));
    }

    @Get("/current")
    current(@Req() req: Request) {
        return {
            data: req.currentUser,
        };
    }
}
