import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AddCommentDto, GetCommentPageDto } from "./dto/comment.dto";
import { PublicAccess } from "@/decorators/public-access.decorator";

@Controller("comment")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @PublicAccess()
    @Get("/page")
    page(@Query() query: GetCommentPageDto) {
        return this.commentService.getPage(query);
    }

    @PublicAccess()
    @Get("/total")
    total() {
        return this.commentService.getTotal();
    }

    @PublicAccess()
    @Post("/add")
    add(@Body() body: AddCommentDto) {
        return this.commentService.add(body);
    }
}
