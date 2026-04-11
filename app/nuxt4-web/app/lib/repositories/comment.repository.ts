import type {
    CommentDTO,
    PageResponse,
    PlainObject,
    PlainResponse,
    QueryCommentPageModel,
    QueryPageModel,
    RecordResponse,
} from "@fullstack-blog/types";
import type { BlogApi } from "~/types/blog";

export const createCommentRepository = (api: BlogApi) => ({
    page: (params: QueryCommentPageModel) => api.get<PageResponse<CommentDTO>>("/comment/page", params),
    detail: (id: number) => api.get<RecordResponse<CommentDTO>>("/comment/detail", { id }),
    add: (params: PlainObject) => api.post("/comment/add", params),
    numberOfPeople: () => api.get<PlainResponse<number>>("/comment/number_of_people"),
    total: () => api.get<PlainResponse<number>>("/comment/total"),
    pageAdmin: (params: QueryPageModel & { type?: number }) => api.get<PageResponse<CommentDTO>>("/comment/page_admin", params),
    update: (params: PlainObject) => api.put("/comment/update", params),
    delete: (id: number) => api.delete("/comment/delete", { id }),
    pageNotApproved: (params: QueryPageModel & { type?: number }) =>
        api.get<PageResponse<CommentDTO>>("/comment/page_not_approved", params),
    review: (params: PlainObject) => api.put("/comment/review", params),
});
