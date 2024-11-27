import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article";
// import { ArticleCategory } from "./ArticleCategory";

@Index("category_name", ["category_name"], { unique: true })
@Entity("category", { schema: "blog_db" })
export class Category {
    @Column("varchar", { name: "category_name", unique: true, length: 50 })
    category_name: string;

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("datetime", {
        name: "create_time",
        default: () => "CURRENT_TIMESTAMP",
    })
    create_time: Date;

    @Column("datetime", { name: "update_time", nullable: true })
    update_time: Date | null;

    @Column("varchar", { name: "poster", nullable: true, length: 300 })
    poster: string | null;

    @ManyToMany(() => Article, (article) => article.categories)
    @JoinTable({
        name: "article_category",
        joinColumn: {
            name: "category_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "article_id",
            referencedColumnName: "id",
        },
    })
    articles: Article[];
}
