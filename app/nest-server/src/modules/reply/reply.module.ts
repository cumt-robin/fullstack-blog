import { Module } from "@nestjs/common";
import { ReplyService } from "./reply.service";
import { ReplyController } from "./reply.controller";
import { Reply } from "@/entities/Reply";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comments } from "@/entities/Comments";
import { Article } from "@/entities/Article";

@Module({
    imports: [TypeOrmModule.forFeature([Reply, Comments, Article])],
    controllers: [ReplyController],
    providers: [ReplyService],
})
export class ReplyModule {}
