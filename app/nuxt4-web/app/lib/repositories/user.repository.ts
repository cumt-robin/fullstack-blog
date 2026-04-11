import type { LoginModel, RecordResponse, UserDTO } from "@fullstack-blog/types";
import type { BlogApi } from "~/types/blog";
import type { RepositoryDeviceContext } from "~/lib/repositories/repository-context";

export const createUserRepository = (api: BlogApi, ctx: RepositoryDeviceContext) => ({
    login: (params: LoginModel) => api.put<RecordResponse<UserDTO>>("/user/login", params, { "X-Device-Id": ctx.getDeviceId() }),
    current: () => api.get<RecordResponse<UserDTO>>("/user/current"),
    logout: () => api.put("/user/logout", {}, { "X-Device-Id": ctx.getDeviceId() }),
});
