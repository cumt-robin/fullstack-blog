import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn({ name: "create_time" })
    create_time: Date;

    @UpdateDateColumn({ name: "update_time", nullable: true })
    update_time: Date | null;
}
