import { Controller, Get, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { FuzzyQueryTagsDto, GetAllTagsDto, GetTagAdminPageDto } from "./dto/tag.dto";

@Controller("tag")
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get("/all")
    getAllTags(@Query() query: GetAllTagsDto) {
        return query.getCount === "1" ? this.tagService.getAllTagsWithArticleCount() : this.tagService.getAllTags();
    }

    @Get("/fuzzy")
    fuzzyQueryTags(@Query() query: FuzzyQueryTagsDto) {
        return this.tagService.fuzzyQueryTags(query.wd);
    }

    @Get("/admin/page")
    getTagAdminPage(@Query() query: GetTagAdminPageDto) {
        return this.tagService.getTagAdminPageWithArticleCount(query);
    }
}
