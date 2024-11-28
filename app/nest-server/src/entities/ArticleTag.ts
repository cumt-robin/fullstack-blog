import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("article_id", ["article_id"], {})
@Index("tag_id", ["tag_id"], {})
@Entity("article_tag", { schema: "blog_db" })
export class ArticleTag {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "article_id" })
    article_id: number;

    @Column("int", { name: "tag_id" })
    tag_id: number;
}
