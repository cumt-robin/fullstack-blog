import { Module } from "@nestjs/common";
import { ValidatorService } from "./validator.service";
import { ValidatorController } from "./validator.controller";

@Module({
    controllers: [ValidatorController],
    providers: [ValidatorService],
})
export class ValidatorModule {}
