import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AddCommentDto, DeleteCommentDto, GetCommentPageDto, GetTypedPageDto, ReviewCommentDto, UpdateCommentDto } from "./dto/comment.dto";
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

    @Get("/page_not_approved")
    pageNotApproved(@Query() query: GetTypedPageDto) {
        return this.commentService.getNotApprovedPage(query);
    }

    @Put("/review")
    review(@Body() body: ReviewCommentDto) {
        return this.commentService.review(body);
    }

    @PublicAccess()
    @Get("/number_of_people")
    numberOfPeople() {
        return this.commentService.getNumberOfPeople();
    }

    @Get("/page_admin")
    pageAdmin(@Query() query: GetTypedPageDto) {
        return this.commentService.getAdminPage(query);
    }

    @Put("/update")
    update(@Body() body: UpdateCommentDto) {
        return this.commentService.update(body);
    }

    @Delete("/delete")
    delete(@Query() query: DeleteCommentDto) {
        return this.commentService.delete(query);
    }
}
