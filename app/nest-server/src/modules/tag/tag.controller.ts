import { Controller, Get, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { GetAllTagsDto } from "./dto/tag.dto";

@Controller("tag")
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get("/all")
    getAllTags(@Query() query: GetAllTagsDto) {
        return query.getCount === "1" ? this.tagService.getAllTagsWithArticleCount() : this.tagService.getAllTags();
    }
}
