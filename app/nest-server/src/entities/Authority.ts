import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Index("AuthName", ["authName"], { unique: true })
@Entity("authority", { schema: "blog_db" })
export class Authority {
    @Column("varchar", { name: "auth_name", unique: true, length: 50 })
    authName: string;

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "auth_description", nullable: true, length: 300 })
    authDescription: string | null;

    @Column("int", { name: "parent_auth_id", nullable: true })
    parentAuthId: number | null;

    @CreateDateColumn({ name: "create_time" })
    create_time: Date;

    @UpdateDateColumn({ name: "update_time", nullable: true })
    update_time: Date | null;
}
