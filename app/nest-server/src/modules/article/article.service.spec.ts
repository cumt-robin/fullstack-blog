import { Test, TestingModule } from "@nestjs/testing";
import { ArticleService } from "./article.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Article } from "@/entities/Article";
import { AuthService } from "../common/auth.service";
import { InnerException } from "@/exceptions/inner.exception";
import { CreateArticleDto, UpdateArticleDto } from "./dto/article.dto";

describe("ArticleService", () => {
    let service: ArticleService;
    let articleRepository: jest.Mocked<Repository<Article>>;
    let authService: jest.Mocked<AuthService>;
    let dataSource: jest.Mocked<DataSource>;

    const mockArticleRepository = {
        find: jest.fn(),
        findAndCount: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockAuthService = {
        extractToken: jest.fn(),
        verify: jest.fn(),
        getCurrentUser: jest.fn(),
    };

    const mockDataSource = {
        transaction: jest.fn(),
    };

    const mockQueryRunner = {
        manager: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            upsert: jest.fn(),
            insert: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ArticleService,
                {
                    provide: getRepositoryToken(Article),
                    useValue: mockArticleRepository,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<ArticleService>(ArticleService);
        articleRepository = module.get(getRepositoryToken(Article));
        authService = module.get(AuthService);
        dataSource = module.get(DataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getTopRead", () => {
        it("should return top read articles", async () => {
            const mockArticles = [
                { id: 1, article_name: "Article 1", read_num: 100, poster: "poster1.jpg" },
                { id: 2, article_name: "Article 2", read_num: 90, poster: "poster2.jpg" },
            ];

            mockArticleRepository.find.mockResolvedValue(mockArticles);

            const result = await service.getTopRead(2);

            expect(mockArticleRepository.find).toHaveBeenCalledWith({
                where: { private: 0, deleted: 0 },
                order: { read_num: "DESC" },
                take: 2,
                select: ["id", "article_name", "read_num", "poster"],
            });
            expect(result).toEqual({ data: mockArticles });
        });
    });

    describe("getPage", () => {
        it("should return paginated articles", async () => {
            const mockArticles = [
                {
                    id: 1,
                    article_name: "Article 1",
                    read_num: 100,
                    poster: "poster1.jpg",
                    summary: "Summary 1",
                    create_time: new Date(),
                    update_time: new Date(),
                    author: { id: 1, nick_name: "Author 1" },
                    categories: [{ id: 1, category_name: "Category 1" }],
                    tags: [{ id: 1, tag_name: "Tag 1" }],
                },
            ];

            mockArticleRepository.findAndCount.mockResolvedValue([mockArticles, 1]);

            const result = await service.getPage({ pageNo: 1, pageSize: 10 });

            expect(mockArticleRepository.findAndCount).toHaveBeenCalledWith({
                where: { deleted: 0, private: 0 },
                skip: 0,
                take: 10,
                relations: ["categories", "tags", "author"],
                select: ["id", "article_name", "read_num", "poster", "summary", "create_time", "update_time"],
                order: { create_time: "DESC" },
            });
            expect(result.data[0].author).toBe("Author 1");
            expect(result.data[0].categories[0]).toEqual({ id: 1, categoryName: "Category 1" });
            expect(result.data[0].tags[0]).toEqual({ id: 1, tagName: "Tag 1" });
            expect(result.total).toBe(1);
        });
    });

    describe("getAdminPage", () => {
        it("should return paginated articles for admin", async () => {
            const mockArticles = [
                {
                    id: 1,
                    article_name: "Article 1",
                    read_num: 100,
                    poster: "poster1.jpg",
                    summary: "Summary 1",
                    create_time: new Date(),
                    update_time: new Date(),
                    private: 0,
                    deleted: 0,
                    author: { id: 1, nick_name: "Author 1" },
                    categories: [{ id: 1, category_name: "Category 1" }],
                    tags: [{ id: 1, tag_name: "Tag 1" }],
                },
            ];

            mockArticleRepository.findAndCount.mockResolvedValue([mockArticles, 1]);

            const result = await service.getAdminPage({ pageNo: 1, pageSize: 10 });

            expect(mockArticleRepository.findAndCount).toHaveBeenCalledWith({
                skip: 0,
                take: 10,
                relations: ["categories", "tags", "author"],
                select: ["id", "article_name", "read_num", "poster", "summary", "create_time", "update_time", "private", "deleted"],
                order: { create_time: "DESC" },
            });
            expect(result.total).toBe(1);
        });
    });

    describe("getNeighbors", () => {
        it("should return previous and next articles", async () => {
            const prevArticle = { id: 1, article_name: "Previous Article" };
            const nextArticle = { id: 3, article_name: "Next Article" };

            mockArticleRepository.findOne.mockResolvedValueOnce(prevArticle).mockResolvedValueOnce(nextArticle);

            const result = await service.getNeighbors(2);

            expect(result.data).toEqual([prevArticle, nextArticle]);
        });

        it("should return only one neighbor when one exists", async () => {
            const prevArticle = { id: 1, article_name: "Previous Article" };

            mockArticleRepository.findOne.mockResolvedValueOnce(prevArticle).mockResolvedValueOnce(null);

            const result = await service.getNeighbors(2);

            expect(result.data).toEqual([prevArticle]);
        });
    });

    describe("updateReadNum", () => {
        it("should update read number", async () => {
            mockArticleRepository.update.mockResolvedValue(undefined);

            await service.updateReadNum(1);

            expect(mockArticleRepository.update).toHaveBeenCalledWith(1, { read_num: expect.any(Function) });
        });
    });

    describe("updatePrivate", () => {
        it("should update private status", async () => {
            mockArticleRepository.update.mockResolvedValue(undefined);

            await service.updatePrivate(1, 1);

            expect(mockArticleRepository.update).toHaveBeenCalledWith(1, { private: 1 });
        });
    });

    describe("updateDeleted", () => {
        it("should update deleted status", async () => {
            mockArticleRepository.update.mockResolvedValue(undefined);

            await service.updateDeleted(1, 1);

            expect(mockArticleRepository.update).toHaveBeenCalledWith(1, { deleted: 1 });
        });
    });

    describe("delete", () => {
        it("should delete article", async () => {
            mockArticleRepository.delete.mockResolvedValue(undefined);

            await service.delete(1);

            expect(mockArticleRepository.delete).toHaveBeenCalledWith(1);
        });
    });

    describe("detail", () => {
        it("should return article detail for public article", async () => {
            const mockArticle = {
                id: 1,
                article_name: "Article 1",
                article_text: "Content",
                author: { id: 1, nick_name: "Author 1" },
                categories: [{ id: 1, category_name: "Category 1" }],
                tags: [{ id: 1, tag_name: "Tag 1" }],
                private: 0,
            };

            mockArticleRepository.findOne.mockResolvedValue(mockArticle);

            const result = await service.detail(1, "");

            expect(result.data.author).toBe("Author 1");
            expect(result.data.author_id).toBe(1);
        });

        it("should throw error when article not found", async () => {
            mockArticleRepository.findOne.mockResolvedValue(null);

            await expect(service.detail(1, "")).rejects.toThrow(InnerException);
        });

        it("should throw error for private article without token", async () => {
            const mockArticle = {
                id: 1,
                article_name: "Article 1",
                article_text: "Content",
                author: { id: 1, nick_name: "Author 1" },
                categories: [],
                tags: [],
                private: 1,
            };

            mockArticleRepository.findOne.mockResolvedValue(mockArticle);
            mockAuthService.extractToken.mockReturnValue(null);

            await expect(service.detail(1, "")).rejects.toThrow(InnerException);
        });

        it("should return private article with valid token", async () => {
            const mockArticle = {
                id: 1,
                article_name: "Article 1",
                article_text: "Content",
                author: { id: 1, nick_name: "Author 1" },
                categories: [],
                tags: [],
                private: 1,
            };

            mockArticleRepository.findOne.mockResolvedValue(mockArticle);
            mockAuthService.extractToken.mockReturnValue("valid-token");
            mockAuthService.verify.mockResolvedValue({ id: 1 });

            const result = await service.detail(1, "");

            expect(mockAuthService.verify).toHaveBeenCalledWith("valid-token");
            expect(result.data.id).toBe(1);
        });
    });

    describe("getPageByCategory", () => {
        it("should return articles by category", async () => {
            const mockArticles = [
                {
                    id: 1,
                    article_name: "Article 1",
                    read_num: 100,
                    poster: "poster1.jpg",
                    summary: "Summary 1",
                    create_time: new Date(),
                    update_time: new Date(),
                    author: { id: 1, nick_name: "Author 1" },
                    categories: [{ id: 1, category_name: "Category 1" }],
                    tags: [],
                },
            ];

            mockArticleRepository.findAndCount.mockResolvedValue([mockArticles, 1]);

            const result = await service.getPageByCategory({ pageNo: 1, pageSize: 10, keyword: "Category 1" });

            expect(result.total).toBe(1);
        });
    });

    describe("getPageByTag", () => {
        it("should return articles by tag", async () => {
            const mockArticles = [
                {
                    id: 1,
                    article_name: "Article 1",
                    read_num: 100,
                    poster: "poster1.jpg",
                    summary: "Summary 1",
                    create_time: new Date(),
                    update_time: new Date(),
                    author: { id: 1, nick_name: "Author 1" },
                    categories: [],
                    tags: [{ id: 1, tag_name: "Tag 1" }],
                },
            ];

            mockArticleRepository.findAndCount.mockResolvedValue([mockArticles, 1]);

            const result = await service.getPageByTag({ pageNo: 1, pageSize: 10, keyword: "Tag 1" });

            expect(result.total).toBe(1);
        });
    });

    describe("create", () => {
        it("should create article successfully", async () => {
            const mockUser = { id: 1 };
            mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

            mockDataSource.transaction.mockImplementation(async (callback) => {
                await callback(mockQueryRunner.manager);
            });

            mockQueryRunner.manager.save.mockResolvedValue({ id: 1 });
            mockQueryRunner.manager.findOneBy.mockResolvedValue(null);

            const createDto: CreateArticleDto = {
                articleTitle: "Test Article",
                articleText: "Content",
                summary: "Summary",
                poster: "poster.jpg",
                newCategories: ["Category 1"],
                oldCategoryIds: [],
                tags: ["Tag 1"],
                private: 0,
            };

            await service.create(createDto, "Bearer token");

            expect(mockAuthService.getCurrentUser).toHaveBeenCalledWith("Bearer token");
            expect(mockDataSource.transaction).toHaveBeenCalled();
        });

        it("should create article without categories and tags", async () => {
            const mockUser = { id: 1 };
            mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

            mockDataSource.transaction.mockImplementation(async (callback) => {
                await callback(mockQueryRunner.manager);
            });

            mockQueryRunner.manager.save.mockResolvedValue({ id: 1 });

            const createDto: CreateArticleDto = {
                articleTitle: "Test Article",
                articleText: "Content",
                summary: "Summary",
                poster: "poster.jpg",
                newCategories: [],
                oldCategoryIds: [],
                tags: [],
                private: 0,
            };

            await service.create(createDto, "Bearer token");

            expect(mockQueryRunner.manager.save).toHaveBeenCalled();
        });
    });

    describe("update", () => {
        it("should update article successfully", async () => {
            const mockArticle = { id: 1, article_name: "Old Title" };
            mockArticleRepository.findOneBy.mockResolvedValue(mockArticle);

            mockDataSource.transaction.mockImplementation(async (callback) => {
                await callback(mockQueryRunner.manager);
            });

            const updateDto: UpdateArticleDto = {
                id: 1,
                articleTitle: "New Title",
                articleText: "New Content",
                summary: "New Summary",
                poster: "new-poster.jpg",
                deleteCategoryIDs: [],
                newCategories: [],
                deleteTagIDs: [],
                newTags: [],
                relatedCategoryIDs: [],
                private: 0,
            };

            await service.update(updateDto);

            expect(mockDataSource.transaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.update).toHaveBeenCalled();
        });

        it("should throw error when article not found", async () => {
            mockArticleRepository.findOneBy.mockResolvedValue(null);

            const updateDto: UpdateArticleDto = {
                id: 1,
                articleTitle: "New Title",
                articleText: "New Content",
                summary: "New Summary",
                poster: "new-poster.jpg",
                deleteCategoryIDs: [],
                newCategories: [],
                deleteTagIDs: [],
                newTags: [],
                relatedCategoryIDs: [],
                private: 0,
            };

            await expect(service.update(updateDto)).rejects.toThrow(InnerException);
        });

        it("should update article with new tags", async () => {
            const mockArticle = { id: 1, article_name: "Old Title" };
            mockArticleRepository.findOneBy.mockResolvedValue(mockArticle);

            mockDataSource.transaction.mockImplementation(async (callback) => {
                await callback(mockQueryRunner.manager);
            });

            mockQueryRunner.manager.findOneBy.mockResolvedValue(null);

            const updateDto: UpdateArticleDto = {
                id: 1,
                articleTitle: "New Title",
                articleText: "New Content",
                summary: "New Summary",
                poster: "new-poster.jpg",
                deleteCategoryIDs: [],
                newCategories: [],
                deleteTagIDs: [],
                newTags: ["New Tag"],
                relatedCategoryIDs: [],
                private: 0,
            };

            await service.update(updateDto);

            expect(mockQueryRunner.manager.upsert).toHaveBeenCalled();
        });

        it("should update article with new categories", async () => {
            const mockArticle = { id: 1, article_name: "Old Title" };
            mockArticleRepository.findOneBy.mockResolvedValue(mockArticle);

            mockDataSource.transaction.mockImplementation(async (callback) => {
                await callback(mockQueryRunner.manager);
            });

            mockQueryRunner.manager.findOneBy.mockResolvedValue(null);

            const updateDto: UpdateArticleDto = {
                id: 1,
                articleTitle: "New Title",
                articleText: "New Content",
                summary: "New Summary",
                poster: "new-poster.jpg",
                deleteCategoryIDs: [],
                newCategories: ["New Category"],
                deleteTagIDs: [],
                newTags: [],
                relatedCategoryIDs: [],
                private: 0,
            };

            await service.update(updateDto);

            expect(mockQueryRunner.manager.upsert).toHaveBeenCalled();
        });

        it("should delete tags from article", async () => {
            const mockArticle = { id: 1, article_name: "Old Title" };
            mockArticleRepository.findOneBy.mockResolvedValue(mockArticle);

            mockDataSource.transaction.mockImplementation(async (callback) => {
                await callback(mockQueryRunner.manager);
            });

            const updateDto: UpdateArticleDto = {
                id: 1,
                articleTitle: "New Title",
                articleText: "New Content",
                summary: "New Summary",
                poster: "new-poster.jpg",
                deleteCategoryIDs: [],
                newCategories: [],
                deleteTagIDs: [1, 2],
                newTags: [],
                relatedCategoryIDs: [],
                private: 0,
            };

            await service.update(updateDto);

            expect(mockQueryRunner.manager.delete).toHaveBeenCalled();
        });

        it("should delete categories from article", async () => {
            const mockArticle = { id: 1, article_name: "Old Title" };
            mockArticleRepository.findOneBy.mockResolvedValue(mockArticle);

            mockDataSource.transaction.mockImplementation(async (callback) => {
                await callback(mockQueryRunner.manager);
            });

            const updateDto: UpdateArticleDto = {
                id: 1,
                articleTitle: "New Title",
                articleText: "New Content",
                summary: "New Summary",
                poster: "new-poster.jpg",
                deleteCategoryIDs: [1, 2],
                newCategories: [],
                deleteTagIDs: [],
                newTags: [],
                relatedCategoryIDs: [],
                private: 0,
            };

            await service.update(updateDto);

            expect(mockQueryRunner.manager.delete).toHaveBeenCalled();
        });

        it("should add related categories to article", async () => {
            const mockArticle = { id: 1, article_name: "Old Title" };
            mockArticleRepository.findOneBy.mockResolvedValue(mockArticle);

            mockDataSource.transaction.mockImplementation(async (callback) => {
                await callback(mockQueryRunner.manager);
            });

            const updateDto: UpdateArticleDto = {
                id: 1,
                articleTitle: "New Title",
                articleText: "New Content",
                summary: "New Summary",
                poster: "new-poster.jpg",
                deleteCategoryIDs: [],
                newCategories: [],
                deleteTagIDs: [],
                newTags: [],
                relatedCategoryIDs: [1, 2],
                private: 0,
            };

            await service.update(updateDto);

            expect(mockQueryRunner.manager.upsert).toHaveBeenCalled();
        });
    });
});
