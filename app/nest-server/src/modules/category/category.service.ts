import { Category } from "@/entities/Category";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { GetCategoryAdminPageDto, UpdateCategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

    async getAllCategories() {
        const data = await this.categoryRepository.find();
        return {
            data,
        };
    }

    async getAllCategoriesWithArticleCount() {
        const categories = await this.categoryRepository
            .createQueryBuilder("category")
            .leftJoin("category.articles", "article")
            .select("category.*")
            .addSelect("COUNT(article.id)", "category_count")
            .groupBy("category.id")
            .getRawMany();
        return {
            data: categories.map((category) => ({
                ...category,
                category_count: parseInt(category.category_count),
            })),
        };
    }

    async fuzzyQueryCategories(wd: string) {
        const data = await this.categoryRepository.find({ where: { category_name: Like(`%${wd}%`) } });
        return {
            data,
        };
    }

    async getCategoryAdminPageWithArticleCount(query: GetCategoryAdminPageDto) {
        const { pageNo, pageSize } = query;
        const builder = this.categoryRepository
            .createQueryBuilder("category")
            .leftJoin("category.articles", "article")
            .select("category.*")
            .addSelect("COUNT(article.id)", "article_count")
            .groupBy("category.id")
            .offset((pageNo - 1) * pageSize)
            .limit(pageSize);

        const [data, total] = await Promise.all([builder.getRawMany(), builder.getCount()]);

        return {
            data: data.map((category) => ({
                ...category,
                article_count: parseInt(category.article_count),
            })),
            total,
        };
    }

    async updateCategory(body: UpdateCategoryDto) {
        const { id, category_name, poster } = body;
        await this.categoryRepository.update(id, { category_name, poster });
    }
}
