import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { ConfigService } from "@nestjs/config";
import { Server } from "socket.io";

@WebSocketGateway({
    namespace: "chatroom",
})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
        private readonly configService: ConfigService,
    ) {
        const port = this.configService.get("PORT");
        this.server.listen(port);
    }

    @SubscribeMessage("chat")
    create(@MessageBody() data: Record<string, any>) {
        console.log(data);
        return this.chatService.create();
    }
}
