import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatService {
    create() {
        return "This action adds a new chat";
    }
}
