import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { User } from "./User";
// import { ArticleCategory } from "./ArticleCategory";
// import { Comments } from "./Comments";
import { Tag } from "./Tag";

@Index("author_id", ["authorId"], {})
@Entity("article", { schema: "blog_db" })
export class Article {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "article_name", comment: "标题", length: 500 })
    articleName: string;

    @Column("longtext", { name: "article_text", comment: "正文markdown" })
    articleText: string;

    @Column("datetime", {
        name: "create_time",
        default: () => "CURRENT_TIMESTAMP",
    })
    createTime: Date;

    @Column("datetime", { name: "update_time", nullable: true })
    updateTime: Date | null;

    @Column("int", { name: "author_id", comment: "作者id" })
    authorId: number;

    @Column("int", {
        name: "read_num",
        nullable: true,
        comment: "阅读量",
        default: () => "'0'",
    })
    readNum: number | null;

    @Column("int", {
        name: "like_num",
        nullable: true,
        comment: "喜欢",
        default: () => "'0'",
    })
    likeNum: number | null;

    @Column("varchar", { name: "summary", comment: "摘要", length: 3000 })
    summary: string;

    @Column("varchar", {
        name: "poster",
        nullable: true,
        comment: "封面",
        length: 1000,
    })
    poster: string | null;

    @Column("tinyint", {
        name: "private",
        nullable: true,
        comment: "是否私密",
        width: 1,
        default: () => "'0'",
    })
    private: boolean | null;

    @Column("tinyint", {
        name: "deleted",
        nullable: true,
        comment: "是否已经被逻辑删除",
        width: 1,
        default: () => "'0'",
    })
    deleted: boolean | null;

    // @ManyToOne(() => User, (user) => user.articles, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn([{ name: "author_id", referencedColumnName: "id" }])
    // author: User;

    // @OneToMany(() => ArticleCategory, (articleCategory) => articleCategory.article)
    // articleCategories: ArticleCategory[];

    @ManyToMany(() => Tag, (tag) => tag.articles)
    tags: Tag[];

    // @OneToMany(() => Comments, (comments) => comments.article)
    // comments: Comments[];
}
