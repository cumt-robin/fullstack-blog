import { Controller, Get, Req } from "@nestjs/common";
import { ValidatorService } from "./validator.service";
import { Request } from "express";
import { PublicAccess } from "@/decorators/public-access.decorator";

@Controller("validator")
export class ValidatorController {
    constructor(private readonly validatorService: ValidatorService) {}

    @PublicAccess()
    @Get("/img_code")
    getImgCode(@Req() req: Request) {
        const { data, text } = this.validatorService.getImgCode();
        console.log(text);
        req.session.captcha = text;
        return { data };
    }
}
