import type { PlainResponse } from "@fullstack-blog/types";
import type { BlogApi } from "~/types/blog";

export const createChatgptRepository = (api: BlogApi) => ({
    feedback: (result: string) => api.postJson("/chatgpt/feedback", { result }),
    changeTopic: () => api.post("/chatgpt/changeTopic"),
    chatV1: (wd: string) => api.get<PlainResponse<string>>("/chatgpt/chat-v1", { wd }),
});
