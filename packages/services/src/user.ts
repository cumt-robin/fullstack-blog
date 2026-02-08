/**
 * @author: Tusi
 * @description: 用户服务
 */
import { LoginModel, RecordResponse, UserDTO } from "@fullstack-blog/types";
import { ApiService } from "./core";

class UserService extends ApiService {
    public login(params: LoginModel) {
        return this.$put<RecordResponse<UserDTO>>("login", params);
    }

    public current() {
        return this.$get<RecordResponse<UserDTO>>("current");
    }

    public logout() {
        return this.$put("logout");
    }
}

export const userService = new UserService("user");
