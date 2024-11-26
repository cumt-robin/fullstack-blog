import { Injectable } from "@nestjs/common";
import { Like, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "@/entities/Tag";
import { GetTagAdminPageDto } from "./dto/tag.dto";

@Injectable()
export class TagService {
    constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

    async getAllTags() {
        const data = await this.tagRepository.find();
        return {
            data,
        };
    }

    async getAllTagsWithArticleCount() {
        const tags = await this.tagRepository
            .createQueryBuilder("tag")
            .leftJoin("tag.articles", "article")
            .select("tag.*")
            .addSelect("COUNT(article.id)", "tag_count")
            .groupBy("tag.id")
            .getRawMany();
        return {
            data: tags.map((tag) => ({
                ...tag,
                tag_count: parseInt(tag.tag_count),
            })),
        };
    }

    async fuzzyQueryTags(wd: string) {
        const data = await this.tagRepository.find({ where: { tag_name: Like(`%${wd}%`) } });
        return {
            data,
        };
    }

    async getTagAdminPageWithArticleCount(query: GetTagAdminPageDto) {
        const { pageNo, pageSize } = query;
        const builder = this.tagRepository
            .createQueryBuilder("tag")
            .leftJoin("tag.articles", "article")
            .select("tag.*")
            .addSelect("COUNT(article.id)", "article_count")
            .groupBy("tag.id")
            .offset((pageNo - 1) * pageSize)
            .limit(pageSize);

        const [data, total] = await Promise.all([builder.getRawMany(), builder.getCount()]);

        return {
            data: data.map((tag) => ({
                ...tag,
                article_count: parseInt(tag.article_count),
            })),
            total,
        };
    }
}
