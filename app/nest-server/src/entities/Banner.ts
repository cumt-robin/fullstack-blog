import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("banner", { schema: "blog_db" })
export class Banner {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "poster", nullable: true, length: 300 })
    poster: string | null;

    @Column("varchar", { name: "link", nullable: true, length: 300 })
    link: string | null;

    @Column("varchar", { name: "name", nullable: true, length: 30 })
    name: string | null;

    @Column("int", { name: "type", nullable: true })
    type: number | null;

    @Column("varchar", { name: "prefer_position", nullable: true, length: 20 })
    preferPosition: string | null;
}
