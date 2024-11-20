import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Article } from "./Article";
// import { Category } from "./Category";

@Index("article_id", ["articleId"], {})
@Index("category_id", ["categoryId"], {})
@Entity("article_category", { schema: "blog_db" })
export class ArticleCategory {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "article_id" })
    articleId: number;

    @Column("int", { name: "category_id" })
    categoryId: number;

    // @ManyToOne(() => Article, (article) => article.articleCategories, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
    // article: Article;

    // @ManyToOne(() => Category, (category) => category.articleCategories, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
    // category: Category;
}
