/**
 * @author: Tusi
 * @description: 分类服务
 */
import { ApiService } from "@/services/index";
import { ArrayResponse, QueryCategoryModel } from "@/bean/xhr";
import { CategoryDTO } from "@/bean/dto";

class CategoryService extends ApiService {
    public all(params?: QueryCategoryModel) {
        return this.$get<ArrayResponse<CategoryDTO>>("all", params);
    }
}

export const categoryService = new CategoryService("category");
