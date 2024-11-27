import { Body, Controller, Get, Put, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { PublicAccess } from "@/decorators/public-access.decorator";
import { FuzzyQueryCategoriesDto, GetAllCategoriesDto, GetCategoryAdminPageDto, UpdateCategoryDto } from "./dto/category.dto";

@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @PublicAccess()
    @Get("/all")
    getAllCategories(@Query() query: GetAllCategoriesDto) {
        return query.getCount === "1" ? this.categoryService.getAllCategoriesWithArticleCount() : this.categoryService.getAllCategories();
    }

    @Get("/fuzzy")
    fuzzyQueryCategories(@Query() query: FuzzyQueryCategoriesDto) {
        return this.categoryService.fuzzyQueryCategories(query.wd);
    }

    @Get("/admin/page")
    getCategoryAdminPage(@Query() query: GetCategoryAdminPageDto) {
        return this.categoryService.getCategoryAdminPageWithArticleCount(query);
    }

    @Put("/admin/update")
    updateCategory(@Body() body: UpdateCategoryDto) {
        return this.categoryService.updateCategory(body);
    }
}
