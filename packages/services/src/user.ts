/**
 * @author: Tusi
 * @description: 用户服务
 */
import { LoginModel, LogoutModel, RecordResponse, UserDTO } from "@fullstack-blog/types";
import { ApiService } from "./core";

class UserService extends ApiService {
    public login(params: LoginModel) {
        return this.$put<RecordResponse<UserDTO>>("login", params);
    }

    public current() {
        return this.$get<RecordResponse<UserDTO>>("current");
    }

    public logout(params: LogoutModel = {}) {
        return this.$put("logout", params);
    }
}

export const userService = new UserService("user");
