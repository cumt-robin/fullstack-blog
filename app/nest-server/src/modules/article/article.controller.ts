import { BadRequestException, Body, Controller, Delete, Get, Headers, Post, Put, Query } from "@nestjs/common";
import { ArticleService } from "./article.service";
import {
    DeleteDto,
    DetailDto,
    GetNeighborsDto,
    GetPageWithKeywordDto,
    GetPageDto,
    GetTopReadDto,
    UpdateDeletedDto,
    UpdatePrivateDto,
    UpdateReadNumDto,
    CreateArticleDto,
    UpdateArticleDto,
} from "./dto/article.dto";
import { PublicAccess } from "@/decorators/public-access.decorator";

@Controller("article")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @PublicAccess()
    @Get("/top_read")
    topRead(@Query() query: GetTopReadDto) {
        return this.articleService.getTopRead(query.count);
    }

    @PublicAccess()
    @Get("/page")
    page(@Query() query: GetPageDto) {
        return this.articleService.getPage(query);
    }

    @Get("/page_admin")
    adminPage(@Query() query: GetPageDto) {
        return this.articleService.getAdminPage(query);
    }

    @PublicAccess()
    @Get("/neighbors")
    neighbors(@Query() query: GetNeighborsDto) {
        return this.articleService.getNeighbors(query.id);
    }

    @PublicAccess()
    @Put("/update_read_num")
    updateReadNum(@Body() body: UpdateReadNumDto) {
        return this.articleService.updateReadNum(body.id);
    }

    @Put("/update_private")
    updatePrivate(@Body() body: UpdatePrivateDto) {
        return this.articleService.updatePrivate(body.id, body.private);
    }

    @Put("/update_deleted")
    updateDeleted(@Body() body: UpdateDeletedDto) {
        return this.articleService.updateDeleted(body.id, body.deleted);
    }

    @Delete("/delete")
    delete(@Query() query: DeleteDto) {
        return this.articleService.delete(query.id);
    }

    @PublicAccess()
    @Get("/detail")
    detail(@Query() query: DetailDto, @Headers("authorization") authorization: string | undefined) {
        return this.articleService.detail(query.id, authorization);
    }

    @PublicAccess()
    @Get("/page_by_category")
    pageByCategory(@Query() query: GetPageWithKeywordDto) {
        return this.articleService.getPageByCategory(query);
    }

    @PublicAccess()
    @Get("/page_by_tag")
    pageByTag(@Query() query: GetPageWithKeywordDto) {
        return this.articleService.getPageByTag(query);
    }

    @Post("/add")
    add(@Body() body: CreateArticleDto, @Headers("authorization") authorization: string | undefined) {
        if ((!body.newCategories || body.newCategories.length === 0) && (!body.oldCategoryIds || body.oldCategoryIds.length === 0)) {
            throw new BadRequestException("分类不能为空");
        }
        return this.articleService.create(body, authorization);
    }

    @Put("/update")
    update(@Body() body: UpdateArticleDto) {
        return this.articleService.update(body);
    }
}
