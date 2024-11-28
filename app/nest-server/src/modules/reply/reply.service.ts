import { Injectable } from "@nestjs/common";
import { CreateReplyDto } from "./dto/create-reply.dto";
import { UpdateReplyDto } from "./dto/update-reply.dto";

@Injectable()
export class ReplyService {
    create(createReplyDto: CreateReplyDto) {
        return "This action adds a new reply";
    }

    findAll() {
        return `This action returns all reply`;
    }

    findOne(id: number) {
        return `This action returns a #${id} reply`;
    }

    update(id: number, updateReplyDto: UpdateReplyDto) {
        return `This action updates a #${id} reply`;
    }

    remove(id: number) {
        return `This action removes a #${id} reply`;
    }
}
