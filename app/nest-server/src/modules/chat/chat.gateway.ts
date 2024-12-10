import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    path: "/socket.io",
    namespace: "/chatroom",
    allowEIO3: true,
    cors: {
        origin: (origin, callback) => {
            const list = process.env.WEB_SOCKET_WHITE_LIST.split(",");
            if (list.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        // origin: "http://localhost:3000",
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private getId(client: Socket) {
        return client.id.replace("/chatroom#", "");
    }

    handleConnection(client: Socket) {
        client.emit("singleMsg", {
            event: "greet_from_server",
            data: {
                content: "hello，欢迎您加入在线聊天室！",
            },
        });
        client.broadcast.emit("broadcast", {
            event: "new_user_join",
            data: {
                user: this.getId(client),
            },
        });
    }

    handleDisconnect(client: Socket) {
        client.broadcast.emit("broadcast", {
            event: "someone_exit",
            data: {
                user: this.getId(client),
            },
        });
    }

    @SubscribeMessage("chat")
    onChat(@MessageBody() data: Record<string, any>, @ConnectedSocket() client: Socket) {
        client.broadcast.emit("broadcast", {
            event: "new_chat_content",
            data: {
                user: this.getId(client),
                content: data,
            },
        });
    }
}
