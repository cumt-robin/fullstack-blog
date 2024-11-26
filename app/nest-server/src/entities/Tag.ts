import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article";

@Index("tag_name", ["tag_name"], { unique: true })
@Entity("tag", { schema: "blog_db" })
export class Tag {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "tag_name", unique: true, length: 50 })
    tag_name: string;

    @Column("datetime", {
        name: "create_time",
        default: () => "CURRENT_TIMESTAMP",
    })
    create_time: Date;

    @Column("datetime", { name: "update_time", nullable: true })
    update_time: Date | null;

    @ManyToMany(() => Article, (article) => article.tags)
    @JoinTable({
        name: "article_tag", // Specify the junction table name
        joinColumn: {
            name: "tag_id", // Name of the column in the junction table that refers to Tag
            referencedColumnName: "id", // The primary key of Tag
        },
        inverseJoinColumn: {
            name: "article_id", // Name of the column in the junction table that refers to Article
            referencedColumnName: "id", // The primary key of Article
        },
    })
    articles: Article[];
}
