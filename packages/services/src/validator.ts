/**
 * @author: Tusi
 * @description: 验证码服务
 */
import { PlainResponse } from "@fullstack-blog/types";
import { ApiService } from "./core";

class ValidatorService extends ApiService {
    public imgCode() {
        return this.$get<PlainResponse<string>>("img_code");
    }
}

export const validatorService = new ValidatorService("validator");
