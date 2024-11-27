import { Controller, Body, Put, Req, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginDto } from "./dto/login.dto";
import { Request } from "express";
import { PublicAccess } from "@/decorators/public-access.decorator";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @PublicAccess()
    @Put("/login")
    login(@Body() loginDto: LoginDto, @Req() req: Request) {
        const sessionCaptcha = req.session.captcha;
        return this.userService.login(loginDto, sessionCaptcha);
    }

    @Put("/logout")
    logout() {
        // TODO: jwt 进入黑名单
        return {};
    }

    @Get("/current")
    current(@Req() req: Request) {
        return {
            data: req.currentUser,
        };
    }
}
