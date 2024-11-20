import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Role } from "./Role";
// import { Authority } from "./Authority";

@Index("role_auth_ibfk_1", ["roleId"], {})
@Index("role_auth_ibfk_2", ["authId"], {})
@Entity("role_auth", { schema: "blog_db" })
export class RoleAuth {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "role_id" })
    roleId: number;

    @Column("int", { name: "auth_id" })
    authId: number;

    // @ManyToOne(() => Role, (role) => role.roleAuths, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
    // role: Role;

    // @ManyToOne(() => Authority, (authority) => authority.roleAuths, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn([{ name: "auth_id", referencedColumnName: "id" }])
    // auth: Authority;
}
