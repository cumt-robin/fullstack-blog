/**
 * @author: Tusi
 * @description: 标签服务
 */
import { ApiService } from "@/services/index";
import { ArrayResponse, QueryTagModel } from "@/bean/xhr";
import { TagDTO } from "@/bean/dto";

class TagService extends ApiService {
    public all(params: QueryTagModel) {
        return this.$get<ArrayResponse<TagDTO>>("all", params);
    }
}

export const tagService = new TagService("tag");
