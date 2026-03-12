import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Article } from "./Article";

@Index("article_id", ["article_id"], {})
@Index("parent_id", ["parent_id"], {})
@Entity("article_outline", { schema: "blog_db" })
export class ArticleOutline {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "article_id", comment: "文章id" })
    article_id: number;

    @Column("int", { name: "parent_id", nullable: true, comment: "父级id" })
    parent_id: number | null;

    @Column("varchar", { name: "title", comment: "标题", length: 500 })
    title: string;

    @Column("varchar", { name: "code", comment: "锚点代码，格式：level-sublevel", length: 50 })
    code: string;

    @Column("int", { name: "level", comment: "层级，从1开始" })
    level: number;

    @Column("int", { name: "order", comment: "排序" })
    order: number;

    @CreateDateColumn({ name: "create_time" })
    create_time: Date;

    @UpdateDateColumn({ name: "update_time", nullable: true })
    update_time: Date | null;

    @ManyToOne(() => Article, (article) => article.outlines, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
    article: Article;

    @ManyToOne(() => ArticleOutline, (outline) => outline.children, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        nullable: true,
    })
    @JoinColumn([{ name: "parent_id", referencedColumnName: "id" }])
    parent: ArticleOutline | null;

    @OneToMany(() => ArticleOutline, (outline) => outline.parent)
    children: ArticleOutline[];
}
