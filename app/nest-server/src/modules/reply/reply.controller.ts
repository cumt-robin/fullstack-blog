import { Controller, Post, Body, Get, Query, Put } from "@nestjs/common";
import { ReplyService } from "./reply.service";
import { AddReplyDto, ReviewReplyDto } from "./dto/reply.dto";
import { PublicAccess } from "@/decorators/public-access.decorator";
import { GetTypedPageDto } from "../comment/dto/comment.dto";

@Controller("reply")
export class ReplyController {
    constructor(private readonly replyService: ReplyService) {}

    @PublicAccess()
    @Post("/add")
    add(@Body() body: AddReplyDto) {
        return this.replyService.add(body);
    }

    @Get("/getReplyOfCommentWaitReview")
    getReplyOfCommentWaitReview() {
        return this.replyService.getReplyOfCommentWaitReview();
    }

    @Get("/getReplyOfMsgWaitReview")
    getReplyOfMsgWaitReview() {
        return this.replyService.getReplyOfMsgWaitReview();
    }

    @Get("/unreviewd_reply_page")
    unreviewdReplyPage(@Query() query: GetTypedPageDto) {
        return this.replyService.getUnreviewdReplyPage(query);
    }

    @Put("/review")
    review(@Body() body: ReviewReplyDto) {
        return this.replyService.review(body);
    }
}
