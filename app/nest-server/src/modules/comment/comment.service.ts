import { Injectable } from "@nestjs/common";
import { GetCommentPageDto } from "./dto/comment.dto";
import { IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "@/entities/Comments";
import { Reply } from "@/entities/Reply";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comments) private commentRepository: Repository<Comments>,
        @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    ) {}

    getPage(query: GetCommentPageDto) {
        const { id, pageNo, pageSize } = query;
        //
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
}
