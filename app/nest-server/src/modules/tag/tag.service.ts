import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "@/entities/Tag";

@Injectable()
export class TagService {
    constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

    getAllTags() {
        return this.tagRepository.find();
    }

    async getAllTagsWithArticleCount() {
        const tags = await this.tagRepository
            .createQueryBuilder("tag")
            .leftJoinAndSelect("tag.articles", "article") // 假设 Tag 和 Article 之间有 ManyToMany 关系
            .select("tag.*")
            .addSelect("COUNT(article.id)", "tag_count")
            .groupBy("tag.id")
            .getRawMany();
        return tags.map((tag) => ({
            ...tag,
            tag_count: parseInt(tag.tag_count),
        }));
    }
}
