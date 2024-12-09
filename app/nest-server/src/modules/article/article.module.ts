import { Module } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "@/entities/Article";
import { Category } from "@/entities/Category";
import { Tag } from "@/entities/Tag";
import { ArticleCategory } from "@/entities/ArticleCategory";
import { ArticleTag } from "@/entities/ArticleTag";

@Module({
    imports: [TypeOrmModule.forFeature([Article, Category, Tag, ArticleCategory, ArticleTag])],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticleModule {}
