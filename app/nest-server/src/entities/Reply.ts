import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comments } from "./Comments";
import { Article } from "./Article";

@Index("a_id", ["comment_id"], {})
@Entity("reply", { schema: "blog_db" })
export class Reply {
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

    @Column("varchar", { name: "nick_name", nullable: true, length: 50 })
    nick_name: string | null;

    @Column("int", { name: "comment_id" })
    comment_id: number;

    @Column("int", { name: "parent_id", nullable: true })
    parent_id: number | null;

    @Column("int", { name: "approved" })
    approved: number;

    @Column("varchar", { name: "jump_url", nullable: true, length: 100 })
    jump_url: string | null;

    @Column("int", { name: "article_id", nullable: true })
    article_id: number | null;

    @ManyToOne(() => Article, (article) => article.replies, { nullable: true })
    @JoinColumn({ name: "article_id" })
    article: Article | null;

    @Column("varchar", { name: "avatar", nullable: true, length: 300 })
    avatar: string | null;

    @Column("varchar", { name: "device", nullable: true, length: 100 })
    device: string | null;

    @ManyToOne(() => Comments, (comments) => comments.replies, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "comment_id", referencedColumnName: "id" }])
    comment: Comments;

    // 自引用关系，指向父回复
    @ManyToOne(() => Reply, (reply) => reply.children, { nullable: true })
    @JoinColumn({ name: "parent_id" })
    parentReply: Reply;

    // 反向关系，指向子回复
    @OneToMany(() => Reply, (reply) => reply.parentReply)
    children: Reply[];
}
