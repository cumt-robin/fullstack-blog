/**
 * @author: Tusi
 * @description: ChatGPT服务
 */
import { ApiService } from "@/services/index";

class ChatgptService extends ApiService {
    public feedback(result: string) {
        return this.$postJson("feedback", { result });
    }

    public changeTopic() {
        return this.$post("changeTopic");
    }
}

export const chatgptService = new ChatgptService("chatgpt");
