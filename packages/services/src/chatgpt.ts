/**
 * @author: Tusi
 * @description: ChatGPT服务
 */
import { PlainResponse } from "@fullstack-blog/types";
import { ApiService } from "./core";

class ChatgptService extends ApiService {
    public feedback(result: string) {
        return this.$postJson("feedback", { result });
    }

    public changeTopic() {
        return this.$post("changeTopic");
    }

    public chatV1(wd: string) {
        return this.$get<PlainResponse<string>>("chat-v1", { wd });
    }
}

export const chatgptService = new ChatgptService("chatgpt");
