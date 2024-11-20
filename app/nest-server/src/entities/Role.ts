import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { RoleAuth } from "./RoleAuth";
// import { User } from "./User";

@Index("RoleName", ["roleName"], { unique: true })
@Entity("role", { schema: "blog_db" })
export class Role {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "role_name", unique: true, length: 50 })
    roleName: string;

    // @OneToMany(() => RoleAuth, (roleAuth) => roleAuth.role)
    // roleAuths: RoleAuth[];

    // @OneToMany(() => User, (user) => user.role)
    // users: User[];
}
