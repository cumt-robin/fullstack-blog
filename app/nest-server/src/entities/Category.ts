import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { ArticleCategory } from "./ArticleCategory";

@Index("category_name", ["categoryName"], { unique: true })
@Entity("category", { schema: "blog_db" })
export class Category {
    @Column("varchar", { name: "category_name", unique: true, length: 50 })
    categoryName: string;

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("datetime", {
        name: "create_time",
        default: () => "CURRENT_TIMESTAMP",
    })
    createTime: Date;

    @Column("datetime", { name: "update_time", nullable: true })
    updateTime: Date | null;

    @Column("varchar", { name: "poster", nullable: true, length: 300 })
    poster: string | null;

    // @OneToMany(() => ArticleCategory, (articleCategory) => articleCategory.category)
    // articleCategories: ArticleCategory[];
}
