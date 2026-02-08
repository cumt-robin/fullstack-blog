/**
 * @author: Tusi
 * @description: 回复服务
 */
import { PlainObject, PageResponse, QueryPageModel, ReplyDTO } from "@fullstack-blog/types";
import { ApiService } from "./core";

class ReplyService extends ApiService {
    public add(params: PlainObject) {
        return this.$post("add", params);
    }

    public unreviewdReplyPage(params: QueryPageModel) {
        return this.$get<PageResponse<ReplyDTO>>("unreviewd_reply_page", params);
    }

    public review(params: PlainObject) {
        return this.$put("review", params);
    }
}

export const replyService = new ReplyService("reply");
