import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        // 创建Nodemailer transporter实例
        this.transporter = nodemailer.createTransport({
            service: "163",
            port: 465, // SMTP端口
            secure: true, // 如果使用465端口，则设置为true
            auth: {
                user: this.configService.get("EMAIL_USER"), // 发件邮箱地址
                pass: this.configService.get("EMAIL_PASS"), // 授权码或密码
            },
        });
    }

    async sendMail(options: nodemailer.SendMailOptions) {
        try {
            const info = await this.transporter.sendMail({
                from: `"${this.configService.get("BLOG_NAME")}" <${this.configService.get("EMAIL_USER")}>`,
                ...options,
            });
            console.log("Email sent:", info.response);
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}
