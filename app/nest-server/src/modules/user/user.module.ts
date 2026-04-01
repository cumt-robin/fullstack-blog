import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/entities/User";
import { Role } from "@/entities/Role";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserSessionModule } from "../user-session/user-session.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET"),
                signOptions: {
                    expiresIn: `3d`,
                },
            }),
        }),
        UserSessionModule,
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
