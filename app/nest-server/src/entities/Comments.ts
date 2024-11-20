import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Article } from "./Article";
// import { Reply } from "./Reply";

@Index("a_id", ["articleId"], {})
@Entity("comments", { schema: "blog_db" })
export class Comments {
    @Column("varchar", { name: "jump_url", nullable: true, length: 100 })
    jumpUrl: string | null;

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
    createTime: Date;

    @Column("datetime", { name: "update_time", nullable: true })
    updateTime: Date | null;

    @Column("varchar", { name: "site_url", nullable: true, length: 100 })
    siteUrl: string | null;

    @Column("varchar", { name: "nick_name", nullable: true, length: 20 })
    nickName: string | null;

    @Column("int", { name: "article_id", nullable: true })
    articleId: number | null;

    @Column("tinyint", { name: "approved", width: 1 })
    approved: boolean;

    @Column("tinyint", { name: "deleted", width: 1, default: () => "'0'" })
    deleted: boolean;

    @Column("varchar", { name: "avatar", nullable: true, length: 300 })
    avatar: string | null;

    @Column("varchar", { name: "device", nullable: true, length: 100 })
    device: string | null;

    // @ManyToOne(() => Article, (article) => article.comments, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
    // article: Article;

    // @OneToMany(() => Reply, (reply) => reply.comment)
    // replies: Reply[];
}
