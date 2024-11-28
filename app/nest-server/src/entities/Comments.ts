import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reply } from "./Reply";
import { Article } from "./Article";

@Index("a_id", ["article_id"], {})
@Entity("comments", { schema: "blog_db" })
export class Comments {
    @Column("varchar", { name: "jump_url", nullable: true, length: 100 })
    jump_url: string | null;

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "email", nullable: true, length: 100 })
    email: string | null;

    @Column("varchar", { name: "content", length: 100 })
    content: string;

    @Column("datetime", {
        name: "create_time",
        default: () => "CURRENT_TIMESTAMP",
    })
    create_time: Date;

    @Column("datetime", { name: "update_time", nullable: true })
    update_time: Date | null;

    @Column("varchar", { name: "site_url", nullable: true, length: 100 })
    site_url: string | null;

    @Column("varchar", { name: "nick_name", nullable: true, length: 20 })
    nick_name: string | null;

    @Column("int", { name: "article_id", nullable: true })
    article_id: number | null;

    @Column("tinyint", { name: "approved", comment: "审核状态", default: () => 0 })
    approved: 0 | 1 | 2;

    @Column("tinyint", { name: "deleted", comment: "是否逻辑删除", default: () => 0 })
    deleted: 0 | 1;

    @Column("varchar", { name: "avatar", nullable: true, length: 300 })
    avatar: string | null;

    @Column("varchar", { name: "device", nullable: true, length: 100 })
    device: string | null;

    @ManyToOne(() => Article, (article) => article.comments, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
    article: Article | null;

    @OneToMany(() => Reply, (reply) => reply.comment)
    replies: Reply[];
}
