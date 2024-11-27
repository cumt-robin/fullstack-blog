import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { InnerException } from "@/exceptions/inner.exception";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@/entities/User";
import { omit } from "lodash";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto, sessionCaptcha: string) {
        if (!sessionCaptcha) {
            throw new InnerException("001001", "验证码有误，换一张试试呢");
        }
        if (loginDto.captcha.toLowerCase() !== sessionCaptcha.toLowerCase()) {
            throw new InnerException("001002", "验证码输入有误");
        }
        const user = await this.userRepository.findOne({
            where: {
                user_name: loginDto.userName,
                password: loginDto.password,
            },
            select: ["id", "role_id", "user_name", "avatar", "last_login_time", "role"],
            relations: ["role"],
        });
        if (!user) {
            throw new InnerException("001003", "用户名或密码输入有误");
        }
        const token = await this.jwtService.signAsync({
            id: user.id,
            userName: user.user_name,
            roleId: user.role_id,
            roleName: user.role.roleName,
        });
        this.userRepository.update(user.id, { last_login_time: new Date() });
        return {
            data: {
                ...omit(user, ["role"]),
                role_name: user.role.roleName,
                token,
            },
        };
    }
}
