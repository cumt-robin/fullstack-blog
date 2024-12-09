import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";
import { Category } from "./Category";
import { Comments } from "./Comments";
import { Reply } from "./Reply";

@Index("author_id", ["author_id"], {})
@Entity("article", { schema: "blog_db" })
export class Article {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "article_name", comment: "标题", length: 500 })
    article_name: string;

    @Column("longtext", { name: "article_text", comment: "正文markdown" })
    article_text: string;

    @Column("datetime", {
        name: "create_time",
        default: () => "CURRENT_TIMESTAMP",
    })
    create_time: Date;

    @Column("datetime", { name: "update_time", nullable: true })
    update_time: Date | null;

    @Column("int", { name: "author_id", comment: "作者id" })
    author_id: number;

    @Column("int", {
        name: "read_num",
        nullable: true,
        comment: "阅读量",
        default: () => "'0'",
    })
    read_num: number | null;

    @Column("int", { name: "like_num", comment: "是否私密", width: 1, default: () => 0 })
    like_num: number;

    @Column("varchar", { name: "summary", comment: "摘要", length: 3000 })
    summary: string;

    @Column("varchar", {
        name: "poster",
        nullable: true,
        comment: "封面",
        length: 1000,
    })
    poster: string | null;

    @Column("tinyint", { name: "private", comment: "是否私密", width: 1, default: () => 0 })
    private: 0 | 1;

    @Column("tinyint", { name: "deleted", comment: "是否逻辑删除", width: 1, default: () => 0 })
    deleted: 0 | 1;

    @ManyToOne(() => User, (user) => user.articles, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "author_id", referencedColumnName: "id" }])
    author: User;

    @ManyToMany(() => Category, (category) => category.articles)
    categories: Category[];

    @ManyToMany(() => Tag, (tag) => tag.articles)
    tags: Tag[];

    @OneToMany(() => Comments, (comments) => comments.article)
    comments: Comments[];

    @OneToMany(() => Reply, (reply) => reply.article)
    replies: Reply[];
}
