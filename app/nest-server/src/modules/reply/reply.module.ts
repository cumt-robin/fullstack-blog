import { Module } from "@nestjs/common";
import { ReplyService } from "./reply.service";
import { ReplyController } from "./reply.controller";

@Module({
    controllers: [ReplyController],
    providers: [ReplyService],
})
export class ReplyModule {}
