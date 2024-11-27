import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";
// import { Article } from "./Article";

@Index("UserName", ["user_name"], { unique: true })
@Index("Email", ["email"], { unique: true })
@Index("Phone", ["phone"], { unique: true })
@Index("role_id", ["role_id"], {})
@Entity("user", { schema: "blog_db" })
export class User {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "user_name", unique: true, length: 50 })
    user_name: string;

    @Column("varchar", { name: "nick_name", length: 50 })
    nick_name: string;

    @Column("varchar", { name: "password", length: 100 })
    password: string;

    @Column("varchar", {
        name: "email",
        nullable: true,
        unique: true,
        length: 50,
    })
    email: string | null;

    @Column("varchar", {
        name: "phone",
        nullable: true,
        unique: true,
        length: 20,
    })
    phone: string | null;

    @Column("varchar", { name: "address", nullable: true, length: 100 })
    address: string | null;

    @Column("int", { name: "role_id" })
    role_id: number;

    @Column("varchar", { name: "avatar", nullable: true, length: 100 })
    avatar: string | null;

    @Column("datetime", { name: "last_login_time", nullable: true })
    last_login_time: Date | null;

    // @OneToMany(() => Article, (article) => article.author)
    // articles: Article[];

    @ManyToOne(() => Role, (role) => role.users, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
    role: Role;
}
