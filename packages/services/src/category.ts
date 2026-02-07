/**
 * @author: Tusi
 * @description: 分类服务
 */
import { ApiService } from "./core";
import { ArrayResponse, PageResponse, QueryCategoryModel, QueryPageModel, UpdateCategoryModel, CategoryDTO } from "@fullstack-blog/types";

class CategoryService extends ApiService {
    public all(params?: QueryCategoryModel) {
        return this.$get<ArrayResponse<CategoryDTO>>("all", params);
    }

    public adminPage(params?: QueryPageModel) {
        return this.$get<PageResponse<CategoryDTO>>("admin/page", params);
    }

    public adminUpdate(params?: UpdateCategoryModel) {
        return this.$putJson<PageResponse<CategoryDTO>>("admin/update", params);
    }

    public fuzzy(params: { wd: string }) {
        return this.$get<ArrayResponse<Pick<CategoryDTO, "id" | "category_name">>>("fuzzy", params);
    }
}

export const categoryService = new CategoryService("category");
