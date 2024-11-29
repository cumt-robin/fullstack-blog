import { Injectable } from "@nestjs/common";
import { AddCommentDto, GetCommentPageDto } from "./dto/comment.dto";
import { IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "@/entities/Comments";
import { Reply } from "@/entities/Reply";
import { SendMailOptions } from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../common/email.service";
import xss from "xss";

@Injectable()
export class CommentService {
    constructor(
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
        @InjectRepository(Comments) private commentRepository: Repository<Comments>,
        @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    ) {}

    async getPage(query: GetCommentPageDto) {
        const { id, pageNo, pageSize } = query;
        const [data, total] = await this.commentRepository.findAndCount({
            where: {
                article_id: id ? id : IsNull(),
                approved: 1,
                replies: {
                    approved: 1,
                },
            },
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            relations: ["replies"],
            select: ["id", "article_id", "content", "create_time", "nick_name", "site_url", "avatar", "device"],
            order: {
                create_time: "DESC",
            },
        });

        return {
            data,
            total,
        };
    }

    async getTotal() {
        const [comments, replies] = await Promise.all([
            this.commentRepository.count({
                where: {
                    article_id: IsNull(),
                    approved: 1,
                },
            }),
            this.replyRepository.count({
                where: {
                    article_id: IsNull(),
                    approved: 1,
                },
            }),
        ]);
        return {
            data: comments + replies,
        };
    }

    async add(body: AddCommentDto) {
        const { content, article_id, nick_name, site_url, email, jump_url } = body;
        const comment = new Comments();
        console.log(typeof xss);
        comment.content = xss(content);
        comment.article_id = article_id;
        comment.nick_name = nick_name;
        comment.site_url = site_url;
        comment.email = email;
        comment.jump_url = jump_url;
        comment.approved = 0;
        await this.commentRepository.save(comment);
        const wd = article_id ? "评论" : "留言";

        const mailOptions: SendMailOptions = {
            to: this.configService.get("AUTHOR_EMAIL"),
            subject: `${this.configService.get("BLOG_NAME")}《收到新的${wd}》`, // 主题
            html: `收到一条新的${wd}，请点击<a href="${this.configService.get("SITE_URL")}" style="font-size:18px">${this.configService.get("BLOG_NAME")}</a>前往查看`,
        };

        await this.emailService.sendMail(mailOptions);

        return {
            msg: `${wd}成功，等待审核`,
        };
    }
}
