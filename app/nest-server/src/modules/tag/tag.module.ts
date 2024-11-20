import { Module } from "@nestjs/common";
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller";
import { Tag } from "src/entities/Tag";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "@/entities/Article";

@Module({
    imports: [TypeOrmModule.forFeature([Tag, Article])],
    controllers: [TagController],
    providers: [TagService],
})
export class TagModule {}
