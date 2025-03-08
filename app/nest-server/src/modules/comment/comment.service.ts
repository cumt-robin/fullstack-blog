import { Injectable } from "@nestjs/common";
import { AddCommentDto, DeleteCommentDto, GetCommentPageDto, GetTypedPageDto, ReviewCommentDto, UpdateCommentDto } from "./dto/comment.dto";
import { IsNull, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "@/entities/Comments";
import { Reply } from "@/entities/Reply";
import { SendMailOptions } from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../common/email.service";
import xss from "xss";
import { omit, uniq } from "lodash";
import { InnerException } from "@/exceptions/inner.exception";

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
        const queryBuilder = this.commentRepository
            .createQueryBuilder("comment")
            .select([
                "comment.id",
                "comment.article_id",
                "comment.content",
                "comment.create_time",
                "comment.nick_name",
                "comment.site_url",
                "comment.avatar",
                "comment.device",
            ])
            .leftJoinAndSelect("comment.replies", "reply", "reply.approved = :replyApproved", { replyApproved: 1 })
            .where("comment.approved = :approved", { approved: 1 })
            .andWhere(id ? "comment.article_id = :articleId" : "comment.article_id IS NULL", id ? { articleId: id } : {})
            .skip((pageNo - 1) * pageSize)
            .take(pageSize)
            .orderBy("comment.create_time", "DESC");

        const [data, total] = await queryBuilder.getManyAndCount();
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

    async getNotApprovedPage(query: GetTypedPageDto) {
        const { type, pageNo, pageSize } = query;
        const [data, total] = await this.commentRepository.findAndCount({
            where: {
                article_id: type === 1 ? Not(IsNull()) : IsNull(),
                approved: 0,
                deleted: 0,
            },
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            relations: type === 1 ? ["article"] : [],
            select: ["id", "content", "create_time", "nick_name", "site_url", "avatar", "jump_url", "device", "email", "approved"],
            order: {
                create_time: "DESC",
            },
        });

        return {
            data: data.map((item) => {
                if (type === 2) {
                    return item;
                }
                const value = omit(item, ["article"]);
                return {
                    ...value,
                    article_name: item.article?.article_name,
                    article_id: item.article?.id,
                };
            }),
            total,
        };
    }

    async review(body: ReviewCommentDto) {
        const { id, approved, jump_url } = body;
        const record = await this.commentRepository.findOneBy({ id });
        if (!record) {
            throw new InnerException("015001", "评论不存在");
        }
        if (record.approved !== 0) {
            throw new InnerException("015002", "评论已审核");
        }
        await this.commentRepository.update(id, { approved });
        if (approved === 1 && record.email) {
            // 发个邮件通知下
            const jumpUrl = jump_url || this.configService.get("SITE_URL");
            this.emailService.replyEmailForMessage(record.email, "留言/评论", record.content, jumpUrl);
        }
    }

    async getNumberOfPeople() {
        const [comments, replies] = await Promise.all([
            this.commentRepository
                .createQueryBuilder()
                .select("DISTINCT nick_name")
                .where("article_id IS NULL AND approved = 1 AND deleted = 0")
                .getRawMany(),
            this.replyRepository
                .createQueryBuilder()
                .select("DISTINCT nick_name")
                .where("article_id IS NULL AND approved = 1")
                .getRawMany(),
        ]);
        return {
            data: uniq([...comments.map((item) => item.nick_name), ...replies.map((item) => item.nick_name)]).length,
        };
    }

    async getAdminPage(query: GetTypedPageDto) {
        const { type, pageNo, pageSize } = query;
        const [data, total] = await this.commentRepository.findAndCount({
            where: {
                article_id: type === 1 ? Not(IsNull()) : IsNull(),
            },
            relations: type === 1 ? ["article"] : [],
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            order: {
                create_time: "DESC",
            },
        });
        return {
            data: data.map((item) => {
                if (type === 2) {
                    return item;
                }
                const value = omit(item, ["article"]);
                return {
                    ...value,
                    article_name: item.article?.article_name,
                    article_id: item.article?.id,
                };
            }),
            total,
        };
    }

    async update(body: UpdateCommentDto) {
        const { id, deleted } = body;
        await this.commentRepository.update(id, { deleted });
    }

    /**
     * 物理删除
     */
    async delete(query: DeleteCommentDto) {
        const { id } = query;
        await this.commentRepository.delete(id);
    }
}
