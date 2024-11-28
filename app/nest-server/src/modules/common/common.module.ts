import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { AuthService } from "./auth.service";

@Module({
    providers: [EmailService, AuthService],
    exports: [EmailService, AuthService],
})
export class CommonModule {}
