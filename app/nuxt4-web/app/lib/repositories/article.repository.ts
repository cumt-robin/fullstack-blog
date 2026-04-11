import type {
    ArrayResponse,
    ArticleDTO,
    PageResponse,
    PlainObject,
    QueryHotColumnModel,
    QueryPageModel,
    QuerySearchModel,
    RecordResponse,
    UpdateArticleDeletedModel,
    UpdateArticlePrivateModel,
} from "@fullstack-blog/types";
import type { BlogApi } from "~/types/blog";

export const createArticleRepository = (api: BlogApi) => ({
    page: (params: QueryPageModel) => api.get<PageResponse<ArticleDTO>>("/article/page", params),
    pageAdmin: (params: QueryPageModel) => api.get<PageResponse<ArticleDTO>>("/article/page_admin", params),
    detail: (id: number) => api.get<RecordResponse<ArticleDTO>>("/article/detail", { id }),
    pageByCategory: (params: QuerySearchModel) => api.get<PageResponse<ArticleDTO>>("/article/page_by_category", params),
    pageByTag: (params: QuerySearchModel) => api.get<PageResponse<ArticleDTO>>("/article/page_by_tag", params),
    updateReadNum: (id: number) => api.put("/article/update_read_num", { id }),
    topRead: (params: QueryHotColumnModel) => api.get<ArrayResponse<ArticleDTO>>("/article/top_read", params),
    neighbors: (id: number) => api.get<ArrayResponse<ArticleDTO>>("/article/neighbors", { id }),
    updatePrivate: (params: UpdateArticlePrivateModel) => api.put("/article/update_private", params),
    updateDeleted: (params: UpdateArticleDeletedModel) => api.put("/article/update_deleted", params),
    delete: (id: number) => api.delete("/article/delete", { id }),
    add: (params: PlainObject) => api.postJson("/article/add", params),
    update: (params: PlainObject) => api.putJson("/article/update", params),
});
