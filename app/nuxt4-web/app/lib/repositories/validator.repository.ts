import type { PlainResponse } from "@fullstack-blog/types";
import type { BlogApi } from "~/types/blog";

export const createValidatorRepository = (api: BlogApi) => ({
    imgCode: () => api.get<PlainResponse<string>>("/validator/img_code"),
});
