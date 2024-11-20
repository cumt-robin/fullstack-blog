import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Comments } from "./Comments";

@Index("a_id", ["commentId"], {})
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
    createTime: Date;

    @Column("datetime", { name: "update_time", nullable: true })
    updateTime: Date | null;

    @Column("varchar", { name: "site_url", nullable: true, length: 100 })
    siteUrl: string | null;

    @Column("varchar", { name: "nick_name", nullable: true, length: 50 })
    nickName: string | null;

    @Column("int", { name: "comment_id" })
    commentId: number;

    @Column("int", { name: "parent_id", nullable: true })
    parentId: number | null;

    @Column("int", { name: "approved" })
    approved: number;

    @Column("varchar", { name: "jump_url", nullable: true, length: 100 })
    jumpUrl: string | null;

    @Column("int", { name: "article_id", nullable: true })
    articleId: number | null;

    @Column("varchar", { name: "avatar", nullable: true, length: 300 })
    avatar: string | null;

    @Column("varchar", { name: "device", nullable: true, length: 100 })
    device: string | null;

    // @ManyToOne(() => Comments, (comments) => comments.replies, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn([{ name: "comment_id", referencedColumnName: "id" }])
    // comment: Comments;
}
