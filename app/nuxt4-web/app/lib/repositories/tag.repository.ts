import type { ArrayResponse, PageResponse, QueryPageModel, TagDTO } from "@fullstack-blog/types";
import type { BlogApi } from "~/types/blog";

export const createTagRepository = (api: BlogApi) => ({
    all: (params?: { getCount?: "0" | "1" }) => api.get<ArrayResponse<TagDTO>>("/tag/all", params || {}),
    adminPage: (params?: QueryPageModel) => api.get<PageResponse<TagDTO>>("/tag/admin/page", params || {}),
    fuzzy: (params: { wd: string }) => api.get<ArrayResponse<TagDTO>>("/tag/fuzzy", params),
});
