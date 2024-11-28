import { Module } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "@/entities/Article";
import { CommonModule } from "../common/common.module";
import { Category } from "@/entities/Category";
import { Tag } from "@/entities/Tag";
import { ArticleCategory } from "@/entities/ArticleCategory";
import { ArticleTag } from "@/entities/ArticleTag";

@Module({
    imports: [CommonModule, TypeOrmModule.forFeature([Article, Category, Tag, ArticleCategory, ArticleTag])],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticleModule {}
