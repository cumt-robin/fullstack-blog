import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Index("RoleName", ["roleName"], { unique: true })
@Entity("role", { schema: "blog_db" })
export class Role {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "role_name", unique: true, length: 50 })
    roleName: string;

    @CreateDateColumn({ name: "create_time" })
    create_time: Date;

    @UpdateDateColumn({ name: "update_time", nullable: true })
    update_time: Date | null;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
