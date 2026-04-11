import type { ArrayResponse, CategoryDTO, PageResponse, QueryPageModel, UpdateCategoryModel } from "@fullstack-blog/types";
import type { BlogApi } from "~/types/blog";

export const createCategoryRepository = (api: BlogApi) => ({
    all: (params?: { getCount?: "0" | "1" }) => api.get<ArrayResponse<CategoryDTO>>("/category/all", params || {}),
    adminPage: (params?: QueryPageModel) => api.get<PageResponse<CategoryDTO>>("/category/admin/page", params || {}),
    adminUpdate: (params?: UpdateCategoryModel) => api.putJson<PageResponse<CategoryDTO>>("/category/admin/update", params || {}),
    fuzzy: (params: { wd: string }) => api.get<ArrayResponse<Pick<CategoryDTO, "id" | "category_name">>>("/category/fuzzy", params),
});
