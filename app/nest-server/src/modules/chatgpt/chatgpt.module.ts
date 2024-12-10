import { Module } from "@nestjs/common";
import { ChatgptController } from "./chatgpt.controller";

@Module({
    controllers: [ChatgptController],
    providers: [],
})
export class ChatgptModule {}
