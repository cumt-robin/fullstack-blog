import { UserSession } from "@/entities/UserSession";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSessionService } from "./user-session.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserSession])],
    providers: [UserSessionService],
    exports: [UserSessionService],
})
export class UserSessionModule {}
