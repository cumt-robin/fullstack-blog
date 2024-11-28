import { Controller, Get, Query } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { GetCommentPageDto } from "./dto/comment.dto";
import { PublicAccess } from "@/decorators/public-access.decorator";

@Controller("comment")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get("/page")
    page(@Query() query: GetCommentPageDto) {
        return this.commentService.getPage(query);
    }

    @PublicAccess()
    @Get("/total")
    total() {
        return this.commentService.getTotal();
    }
}
