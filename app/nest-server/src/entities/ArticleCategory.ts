import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Index("article_id", ["article_id"], {})
@Index("category_id", ["category_id"], {})
@Entity("article_category", { schema: "blog_db" })
export class ArticleCategory {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "article_id" })
    article_id: number;

    @Column("int", { name: "category_id" })
    category_id: number;

    @CreateDateColumn({ type: "datetime", name: "create_time" })
    create_time: Date;

    @UpdateDateColumn({ type: "datetime", name: "update_time", nullable: true })
    update_time: Date | null;
}
