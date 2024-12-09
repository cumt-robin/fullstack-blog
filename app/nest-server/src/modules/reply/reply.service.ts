import { BadRequestException, Injectable } from "@nestjs/common";
import { AddReplyDto, ReviewReplyDto } from "./dto/reply.dto";
import { Reply } from "@/entities/Reply";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import xss from "xss";
import { SendMailOptions } from "nodemailer";
import { EmailService } from "../common/email.service";
import { ConfigService } from "@nestjs/config";
import { Comments } from "@/entities/Comments";
import { Article } from "@/entities/Article";
import { omit } from "lodash";
import { GetTypedPageDto } from "../comment/dto/comment.dto";

@Injectable()
export class ReplyService {
    constructor(
        @InjectRepository(Reply) private readonly replyRepository: Repository<Reply>,
        @InjectRepository(Comments) private readonly commentsRepository: Repository<Comments>,
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
    ) {}

    async add(body: AddReplyDto) {
        const { comment_id, parent_id, article_id, content, nick_name, jump_url, email, site_url, avatar, device } = body;

        const comment = await this.commentsRepository.findOne({ where: { id: comment_id } });
        if (!comment) {
            throw new BadRequestException("评论不存在");
        }

        let parentReply: Reply | null = null;
        if (parent_id) {
            parentReply = await this.replyRepository.findOne({ where: { id: parent_id } });
            if (!parentReply) {
                throw new BadRequestException("父级回复不存在");
            }
            if (parentReply.comment_id !== comment_id) {
                throw new BadRequestException("父级回复不属于当前评论");
            }
        }

        if (article_id) {
            const article = await this.articleRepository.findOne({ where: { id: article_id } });
            if (!article) {
                throw new BadRequestException("文章不存在");
            }
            if (parentReply && parentReply.article_id !== article_id) {
                throw new BadRequestException("父级回复与待创建的回复所归属的文章不一致");
            }
        }

        const reply = new Reply();
        reply.comment_id = comment_id;
        reply.parent_id = parent_id;
        reply.article_id = article_id;
        reply.content = xss(content);
        reply.nick_name = nick_name;
        reply.jump_url = jump_url;
        reply.email = email;
        reply.site_url = site_url;
        reply.avatar = avatar;
        reply.device = device;
        reply.approved = 0;
        const wd = article_id ? "评论" : "留言";
        await this.replyRepository.save(reply);
        const mailOptions: SendMailOptions = {
            to: this.configService.get("AUTHOR_EMAIL"),
            subject: `${this.configService.get("BLOG_NAME")}《收到新的${wd}回复》`, // 主题
            html: `收到一条新的${wd}回复，请点击<a href="${this.configService.get("SITE_URL")}" style="font-size:18px">${this.configService.get("BLOG_NAME")}</a>前往查看`,
        };
        await this.emailService.sendMail(mailOptions);
        return {
            msg: `${wd}成功，等待审核`,
        };
    }

    async getReplyOfCommentWaitReview() {
        const replyList = await this.replyRepository.find({
            where: { approved: 0, article_id: Not(IsNull()) },
            relations: ["comment", "parentReply", "article"],
            select: {
                comment: {
                    id: true,
                    content: true,
                },
                parentReply: {
                    id: true,
                    content: true,
                },
                article: {
                    id: true,
                    article_name: true,
                },
            },
            order: {
                create_time: "DESC",
            },
        });
        return {
            data: replyList.map((reply) => ({
                ...omit(reply, ["comment", "parentReply", "article"]),
                comment_content: reply.comment.content,
                reply_to_content: reply.parentReply?.content,
                article_name: reply.article?.article_name,
            })),
        };
    }

    async getReplyOfMsgWaitReview() {
        const replyList = await this.replyRepository.find({
            where: { approved: 0, article_id: IsNull() },
            relations: ["comment", "parentReply"],
            select: {
                comment: {
                    id: true,
                    content: true,
                },
                parentReply: {
                    id: true,
                    content: true,
                },
            },
            order: {
                create_time: "DESC",
            },
        });
        return {
            data: replyList.map((reply) => ({
                ...omit(reply, ["comment", "parentReply", "article"]),
                comment_content: reply.comment.content,
                reply_to_content: reply.parentReply?.content,
            })),
        };
    }

    async getUnreviewdReplyPage(query: GetTypedPageDto) {
        const { pageNo, pageSize, type } = query;
        const [replyList, total] = await this.replyRepository.findAndCount({
            where: { approved: 0, article_id: type === 1 ? Not(IsNull()) : IsNull() },
            relations: type === 1 ? ["article", "comment", "parentReply"] : ["comment", "parentReply"],
            select: {
                article: {
                    id: true,
                    article_name: true,
                },
                comment: {
                    id: true,
                    content: true,
                },
                parentReply: {
                    id: true,
                    content: true,
                },
            },
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            order: {
                create_time: "DESC",
            },
        });
        return {
            data: replyList.map((reply) => {
                return {
                    ...omit(reply, ["article", "comment", "parentReply"]),
                    article_name: reply.article?.article_name,
                    comment_content: reply.comment?.content,
                    reply_to_content: reply.parentReply?.content,
                };
            }),
            total,
        };
    }

    async review(body: ReviewReplyDto) {
        const { id, approved, email, jump_url, content } = body;
        const reply = await this.replyRepository.findOne({ where: { id } });
        if (!reply) {
            throw new BadRequestException("回复不存在");
        }
        if (reply.approved !== 0) {
            throw new BadRequestException("回复已审核");
        }
        await this.replyRepository.update(id, { approved });
        if (approved === 1 && email) {
            // 发个邮件通知下
            const jumpUrl = jump_url || this.configService.get("SITE_URL");
            await this.emailService.sendMail({
                from: `"${this.configService.get("BLOG_NAME")}" <${this.configService.get("AUTHOR_EMAIL")}>`,
                to: email,
                subject: `${this.configService.get("BLOG_NAME")}《回复审核通过》`,
                html: `<h1 style="text-align:center;color:#409EFF">感谢您在<a href="${jumpUrl}">${this.configService.get("BLOG_NAME")}</a>留下足迹</h1>\
        您的回复<strong style="display:block;font-size:18px">${content}</strong>已经审核通过，请点击<a href="${jumpUrl}" style="font-size:18px">${this.configService.get("BLOG_NAME")}</a>前往查看`,
            });
        }
        return {
            msg: "审核成功",
        };
    }
}
