import { Article } from "@/entities/Article";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, In, LessThan, Like, MoreThan, Repository } from "typeorm";
import { GetPageWithKeywordDto, GetPageDto, CreateArticleDto, UpdateArticleDto } from "./dto/article.dto";
import { InnerException } from "@/exceptions/inner.exception";
import { AuthService } from "../common/auth.service";
import { Category } from "@/entities/Category";
import { ArticleCategory } from "@/entities/ArticleCategory";
import { Tag } from "@/entities/Tag";
import { ArticleTag } from "@/entities/ArticleTag";
import { ArticleOutline } from "@/entities/ArticleOutline";
import { PushSubscriptionService } from "../push-subscription/push-subscription.service";
import * as crypto from "crypto";
import { Request } from "express";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article) private articleRepository: Repository<Article>,
        private readonly authService: AuthService,
        private readonly pushSubscriptionService: PushSubscriptionService,
        private dataSource: DataSource,
    ) {}

    /**
     * 计算 outline 的 hash 值
     */
    private calculateOutlineHash(outlines: any[]): string {
        if (!outlines || outlines.length === 0) {
            return "";
        }
        const outlineStr = JSON.stringify(
            outlines.map((o) => ({
                title: o.title,
                code: o.code,
                level: o.level,
                order: o.order,
                parent_id: o.parent_id,
            })),
        );
        return crypto.createHash("md5").update(outlineStr).digest("hex");
    }

    /**
     * 保存 outline 数据
     * 前端传递的 outlines 已经包含 parent_id（使用 order 作为临时值），这里需要转换为实际的数据库 ID
     */
    private async saveOutlines(manager: EntityManager, articleId: number, outlines: any[]): Promise<void> {
        if (!outlines || outlines.length === 0) {
            return;
        }

        // 先删除该文章的所有旧 outline
        await manager.delete(ArticleOutline, { article_id: articleId });

        // 按 order 排序，确保按顺序插入
        const sortedOutlines = [...outlines].sort((a, b) => a.order - b.order);
        const savedOutlines: ArticleOutline[] = [];
        const orderToIdMap = new Map<number, number>(); // order -> id 的映射
        // 第一轮：保存所有 outline，parent_id 先设为 null
        for (const outlineData of sortedOutlines) {
            const outline = new ArticleOutline();
            outline.article_id = articleId;
            outline.title = outlineData.title;
            outline.code = outlineData.code;
            outline.level = outlineData.level;
            outline.order = outlineData.order;
            outline.parent_id = null; // 先设为 null，第二轮再设置
            const savedOutline = await manager.save(outline);
            savedOutlines.push(savedOutline);
            orderToIdMap.set(outlineData.order, savedOutline.id);
        }

        // 第二轮：根据前端传递的 parent_id（使用 order 临时值）设置实际的 parent_id
        for (let i = 0; i < savedOutlines.length; i++) {
            const currentOutline = savedOutlines[i];
            const outlineData = sortedOutlines[i];

            // 如果前端传递了 parent_id（使用 order 临时值），转换为实际的数据库 ID
            if (outlineData.parent_id !== null && outlineData.parent_id !== undefined) {
                const parentId = orderToIdMap.get(outlineData.parent_id);
                if (parentId) {
                    currentOutline.parent_id = parentId;
                    await manager.save(currentOutline);
                }
            }
        }
    }

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
            data: [prev, next].filter((item) => !!item),
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

    async detail(id: number, request: Request) {
        const data = await this.articleRepository.findOne({
            where: { id },
            relations: ["categories", "tags", "author", "outlines"],
            select: {
                id: true,
                article_name: true,
                article_text: true,
                create_time: true,
                update_time: true,
                read_num: true,
                like_num: true,
                summary: true,
                poster: true,
            },
        });
        if (!data) {
            throw new InnerException("004001", "文章不存在");
        }
        if (data.private) {
            // 如果是私密的，先判断有没有token
            const token = this.authService.extractTokenFromRequest(request);
            if (!token) {
                throw new InnerException("000003", "抱歉，您没有权限访问该内容");
            }
            const currentUser = await this.authService.verify(token);
            if (!currentUser) {
                throw new InnerException("000003", "抱歉，您没有权限访问该内容");
            }
        }

        const outlines = data.outlines
            ? [...data.outlines]
                  .sort((a, b) => a.order - b.order)
                  .map((outline) => ({
                      id: outline.id,
                      title: outline.title,
                      code: outline.code,
                      level: outline.level,
                      parent_id: outline.parent_id,
                  }))
            : [];

        return {
            data: {
                ...data,
                author: data.author.nick_name,
                categories: data.categories.map((category) => ({ id: category.id, categoryName: category.category_name })),
                tags: data.tags.map((tag) => ({ id: tag.id, tagName: tag.tag_name })),
                outlines,
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
        const { articleTitle, articleText, summary, poster, newCategories, oldCategoryIds, tags, private: _private, outlines } = body;

        const currentUser = await this.authService.getCurrentUser(authorization);
        let createdArticleId = 0;

        await this.dataSource.transaction(async (manager) => {
            const article = new Article();
            article.article_name = articleTitle;
            article.article_text = articleText;
            article.summary = summary;
            article.poster = poster;
            article.author_id = currentUser.id;
            article.private = _private;
            if (outlines && outlines.length > 0) {
                article.outline_hash = this.calculateOutlineHash(outlines);
            }
            await manager.save(article);
            createdArticleId = article.id;
            const tasks = [];

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

            if (oldCategoryIds && oldCategoryIds.length > 0) {
                tasks.push(async () => {
                    await manager.insert(
                        ArticleCategory,
                        oldCategoryIds.map((id) => ({ article_id: article.id, category_id: id })),
                    );
                });
            }

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

            if (outlines && outlines.length > 0) {
                tasks.push(async () => {
                    await this.saveOutlines(manager, article.id, outlines);
                });
            }

            await Promise.all(tasks.map((task) => task()));
        });

        // 异步执行推送，不阻塞接口响应
        this.pushSubscriptionService
            .pushArticle({
                eventType: "article_created",
                articleId: createdArticleId,
                title: articleTitle,
                summary,
            })
            .catch((error) => {
                // 记录错误但不影响接口响应
                console.error("Push notification failed:", error);
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
            outlines,
        } = body;

        const article = await this.articleRepository.findOneBy({ id });
        if (!article) {
            throw new InnerException("004001", "文章不存在");
        }

        await this.dataSource.transaction(async (manager) => {
            let needUpdateOutline = false;
            let newOutlineHash: string | null = null;

            if (outlines && outlines.length > 0) {
                newOutlineHash = this.calculateOutlineHash(outlines);
                if (article.outline_hash !== newOutlineHash) {
                    needUpdateOutline = true;
                }
            } else if (outlines && outlines.length === 0) {
                if (article.outline_hash) {
                    needUpdateOutline = true;
                    newOutlineHash = "";
                }
            }

            const updateData: any = {
                article_name: articleTitle,
                article_text: articleText,
                summary,
                poster,
                private: _private,
            };
            if (needUpdateOutline) {
                updateData.outline_hash = newOutlineHash;
            }
            await manager.update(Article, id, updateData);

            const tasks = [];

            if (deleteTagIDs && deleteTagIDs.length > 0) {
                tasks.push(async () => {
                    await manager.delete(ArticleTag, { article_id: article.id, tag_id: In(deleteTagIDs) });
                });
            }

            if (newTags && newTags.length > 0) {
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

            if (needUpdateOutline) {
                tasks.push(async () => {
                    await this.saveOutlines(manager, article.id, outlines || []);
                });
            }

            await Promise.all(tasks.map((task) => task()));
        });

        // 异步执行推送，不阻塞接口响应
        this.pushSubscriptionService
            .pushArticle({
                eventType: "article_updated",
                articleId: article.id,
                title: articleTitle || article.article_name,
                summary: summary || article.summary,
            })
            .catch((error) => {
                // 记录错误但不影响接口响应
                console.error("Push notification failed:", error);
            });
    }
}
