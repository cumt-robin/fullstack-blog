import { Global, Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { AuthService } from "./auth.service";

@Global()
@Module({
    providers: [EmailService, AuthService],
    exports: [EmailService, AuthService],
})
export class CommonModule {}
