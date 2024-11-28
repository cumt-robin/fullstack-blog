import { Article } from "@/entities/Article";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, LessThan, Like, MoreThan, Repository } from "typeorm";
import { GetPageWithKeywordDto, GetPageDto, CreateArticleDto, UpdateArticleDto } from "./dto/article.dto";
import { InnerException } from "@/exceptions/inner.exception";
import { AuthService } from "../auth/auth.service";
import { Category } from "@/entities/Category";
import { ArticleCategory } from "@/entities/ArticleCategory";
import { Tag } from "@/entities/Tag";
import { ArticleTag } from "@/entities/ArticleTag";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article) private articleRepository: Repository<Article>,
        private readonly authService: AuthService,
        private dataSource: DataSource,
    ) {}

    async getTopRead(count: number) {
        const data = await this.articleRepository.find({
            where: {
                private: 0,
                deleted: 0,
            },
            order: {
                read_num: "DESC",
            },
            take: count,
            select: ["id", "article_name", "read_num", "poster"],
        });
        return {
            data,
        };
    }

    async getPage(query: GetPageDto) {
        const { pageNo, pageSize } = query;
        const [data, total] = await this.articleRepository.findAndCount({
            where: { deleted: 0, private: 0 },
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            relations: ["categories", "tags", "author"],
            select: ["id", "article_name", "read_num", "poster", "summary", "create_time", "update_time"],
            order: {
                create_time: "DESC",
            },
        });
        return {
            data: data.map((item) => ({
                ...item,
                author: item.author.nick_name,
                categories: item.categories.map((category) => ({ id: category.id, categoryName: category.category_name })),
                tags: item.tags.map((tag) => ({ id: tag.id, tagName: tag.tag_name })),
            })),
            total,
        };
    }

    async getAdminPage(query: GetPageDto) {
        const { pageNo, pageSize } = query;
        const [data, total] = await this.articleRepository.findAndCount({
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            relations: ["categories", "tags", "author"],
            select: ["id", "article_name", "read_num", "poster", "summary", "create_time", "update_time", "private", "deleted"],
            order: {
                create_time: "DESC",
            },
        });
        return {
            data: data.map((item) => ({
                ...item,
                author: item.author.nick_name,
                categories: item.categories.map((category) => ({ id: category.id, categoryName: category.category_name })),
                tags: item.tags.map((tag) => ({ id: tag.id, tagName: tag.tag_name })),
            })),
            total,
        };
    }

    async getNeighbors(id: number) {
        const [prev, next] = await Promise.all([
            this.articleRepository.findOne({
                where: { deleted: 0, private: 0, id: LessThan(id) },
                order: { id: "DESC" },
                select: ["id", "article_name"],
            }),
            this.articleRepository.findOne({
                where: { deleted: 0, private: 0, id: MoreThan(id) },
                order: { id: "ASC" },
                select: ["id", "article_name"],
            }),
        ]);
        return {
            data: [prev, next],
        };
    }

    async updateReadNum(id: number) {
        await this.articleRepository.update(id, { read_num: () => "read_num + 1" });
    }

    async updatePrivate(id: number, _private: 0 | 1) {
        await this.articleRepository.update(id, { private: _private });
    }

    async updateDeleted(id: number, _deleted: 0 | 1) {
        await this.articleRepository.update(id, { deleted: _deleted });
    }

    async delete(id: number) {
        await this.articleRepository.delete(id);
    }

    async detail(id: number, authorization: string) {
        const data = await this.articleRepository.findOne({
            where: { id },
            relations: ["categories", "tags", "author"],
        });
        if (!data) {
            throw new InnerException("004001", "文章不存在");
        }
        if (data.private) {
            // // 如果是私密的，先判断有没有token
            const token = this.authService.extractToken(authorization);
            if (!token) {
                throw new InnerException("000003", "抱歉，您没有权限访问该内容");
            }
            const currentUser = await this.authService.verify(token);
            if (!currentUser) {
                throw new InnerException("000003", "抱歉，您没有权限访问该内容");
            }
        }
        return {
            data: {
                ...data,
                author: data.author.nick_name,
                author_id: data.author.id,
                categories: data.categories.map((category) => ({ id: category.id, categoryName: category.category_name })),
                tags: data.tags.map((tag) => ({ id: tag.id, tagName: tag.tag_name })),
            },
        };
    }

    async getPageByCategory(query: GetPageWithKeywordDto) {
        const { pageNo, pageSize, keyword } = query;
        const [data, total] = await this.articleRepository.findAndCount({
            where: { deleted: 0, private: 0, categories: { category_name: Like(`%${keyword}%`) } },
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            relations: ["categories", "tags", "author"],
            select: ["id", "article_name", "read_num", "poster", "summary", "create_time", "update_time"],
            order: {
                create_time: "DESC",
            },
        });
        return {
            data: data.map((item) => ({
                ...item,
                author: item.author.nick_name,
                categories: item.categories.map((category) => ({ id: category.id, categoryName: category.category_name })),
                tags: item.tags.map((tag) => ({ id: tag.id, tagName: tag.tag_name })),
            })),
            total,
        };
    }

    async getPageByTag(query: GetPageWithKeywordDto) {
        const { pageNo, pageSize, keyword } = query;
        const [data, total] = await this.articleRepository.findAndCount({
            where: { deleted: 0, private: 0, tags: { tag_name: Like(`%${keyword}%`) } },
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            relations: ["categories", "tags", "author"],
            select: ["id", "article_name", "read_num", "poster", "summary", "create_time", "update_time"],
            order: {
                create_time: "DESC",
            },
        });
        return {
            data: data.map((item) => ({
                ...item,
                author: item.author.nick_name,
                categories: item.categories.map((category) => ({ id: category.id, categoryName: category.category_name })),
                tags: item.tags.map((tag) => ({ id: tag.id, tagName: tag.tag_name })),
            })),
            total,
        };
    }

    async create(body: CreateArticleDto, authorization: string | undefined) {
        const { articleTitle, articleText, summary, poster, newCategories, oldCategoryIds, tags } = body;

        const currentUser = await this.authService.getCurrentUser(authorization);

        await this.dataSource.transaction(async (manager) => {
            // 插入文章表
            const article = new Article();
            article.article_name = articleTitle;
            article.article_text = articleText;
            article.summary = summary;
            article.poster = poster;
            article.author_id = currentUser.id;
            await manager.save(article);
            const tasks = [];
            // 如果存在新的分类，插入分类表
            if (newCategories && newCategories.length > 0) {
                // 插入分类表，得到 ids
                tasks.push(async () => {
                    const newCategoryIds = await Promise.all(
                        newCategories.map((category) =>
                            manager.findOneBy(Category, { category_name: category }).then((item) => {
                                if (item) {
                                    return item.id;
                                }
                                const newItem = new Category();
                                newItem.category_name = category;
                                return manager.save(newItem).then((item) => item.id);
                            }),
                        ),
                    );
                    // 插入文章分类关系表
                    await manager.upsert(
                        ArticleCategory,
                        newCategoryIds.map((id) => ({ article_id: article.id, category_id: id })),
                        ["article_id", "category_id"],
                    );
                });
            }
            // 如果选择了旧的分类，插入文章分类关系表
            if (oldCategoryIds && oldCategoryIds.length > 0) {
                tasks.push(async () => {
                    await manager.insert(
                        ArticleCategory,
                        oldCategoryIds.map((id) => ({ article_id: article.id, category_id: id })),
                    );
                });
            }
            // 插入标签和关系
            if (tags && tags.length > 0) {
                tasks.push(async () => {
                    const tagIds = await Promise.all(
                        tags.map((tag) =>
                            manager.findOneBy(Tag, { tag_name: tag }).then((item) => {
                                if (item) {
                                    return item.id;
                                }
                                const newItem = new Tag();
                                newItem.tag_name = tag;
                                return manager.save(newItem).then((item) => item.id);
                            }),
                        ),
                    );
                    await manager.upsert(
                        ArticleTag,
                        tagIds.map((id) => ({ article_id: article.id, tag_id: id })),
                        ["article_id", "tag_id"],
                    );
                });
            }
            await Promise.all(tasks.map((task) => task()));
        });
    }

    async update(body: UpdateArticleDto) {
        const {
            id,
            articleTitle,
            articleText,
            summary,
            poster,
            deleteCategoryIDs,
            newCategories,
            deleteTagIDs,
            newTags,
            relatedCategoryIDs,
            private: _private,
        } = body;

        const article = await this.articleRepository.findOneBy({ id });
        if (!article) {
            throw new InnerException("004001", "文章不存在");
        }

        await this.dataSource.transaction(async (manager) => {
            // 更新文章表
            await manager.update(Article, id, {
                article_name: articleTitle,
                article_text: articleText,
                summary,
                poster,
                private: _private,
                update_time: new Date(),
            });

            const tasks = [];

            if (deleteTagIDs && deleteTagIDs.length > 0) {
                tasks.push(async () => {
                    await manager.delete(ArticleTag, { article_id: article.id, tag_id: In(deleteTagIDs) });
                });
            }

            if (newTags && newTags.length > 0) {
                // 插入标签和关系
                tasks.push(async () => {
                    const tagIds = await Promise.all(
                        newTags.map((tag) =>
                            manager.findOneBy(Tag, { tag_name: tag }).then((item) => {
                                if (item) {
                                    return item.id;
                                }
                                const newItem = new Tag();
                                newItem.tag_name = tag;
                                return manager.save(newItem).then((item) => item.id);
                            }),
                        ),
                    );
                    await manager.upsert(
                        ArticleTag,
                        tagIds.map((id) => ({ article_id: article.id, tag_id: id })),
                        ["article_id", "tag_id"],
                    );
                });
            }

            if (deleteCategoryIDs && deleteCategoryIDs.length > 0) {
                tasks.push(async () => {
                    await manager.delete(ArticleCategory, { article_id: article.id, category_id: In(deleteCategoryIDs) });
                });
            }

            if (newCategories && newCategories.length > 0) {
                tasks.push(async () => {
                    const newCategoryIds = await Promise.all(
                        newCategories.map((category) =>
                            manager.findOneBy(Category, { category_name: category }).then((item) => {
                                if (item) {
                                    return item.id;
                                }
                                const newItem = new Category();
                                newItem.category_name = category;
                                return manager.save(newItem).then((item) => item.id);
                            }),
                        ),
                    );
                    await manager.upsert(
                        ArticleCategory,
                        newCategoryIds.map((id) => ({ article_id: article.id, category_id: id })),
                        ["article_id", "category_id"],
                    );
                });
            }

            if (relatedCategoryIDs && relatedCategoryIDs.length > 0) {
                tasks.push(async () => {
                    await manager.upsert(
                        ArticleCategory,
                        relatedCategoryIDs.map((id) => ({ article_id: article.id, category_id: id })),
                        ["article_id", "category_id"],
                    );
                });
            }

            await Promise.all(tasks.map((task) => task()));
        });
    }
}
