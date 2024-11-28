import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comments } from "@/entities/Comments";
import { Reply } from "@/entities/Reply";
import { CommonModule } from "../common/common.module";

@Module({
    imports: [CommonModule, TypeOrmModule.forFeature([Comments, Reply])],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
