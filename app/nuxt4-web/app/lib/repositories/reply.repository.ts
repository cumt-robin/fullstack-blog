import type { PageResponse, PlainObject, QueryPageModel, ReplyDTO } from "@fullstack-blog/types";
import type { BlogApi } from "~/types/blog";

export const createReplyRepository = (api: BlogApi) => ({
    add: (params: PlainObject) => api.post("/reply/add", params),
    unreviewdReplyPage: (params: QueryPageModel) => api.get<PageResponse<ReplyDTO>>("/reply/unreviewd_reply_page", params),
    review: (params: PlainObject) => api.put("/reply/review", params),
});
