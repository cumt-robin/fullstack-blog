import { User } from "@/entities/User";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Index("IDX_user_session_user_device_status", ["user_id", "device_id", "status"], {})
@Index("IDX_user_session_device_status", ["device_id", "status"], {})
@Entity("user_session", { schema: "blog_db" })
export class UserSession {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "user_id" })
    user_id: number;

    @Column("varchar", { name: "device_id", length: 128 })
    device_id: string;

    @Column("tinyint", { name: "status", width: 1, default: () => 1, comment: "1-active, 0-inactive" })
    status: 0 | 1;

    @Column("datetime", { name: "login_at", nullable: true })
    login_at: Date | null;

    @Column("datetime", { name: "logout_at", nullable: true })
    logout_at: Date | null;

    @Column("datetime", { name: "last_seen_at", nullable: true })
    last_seen_at: Date | null;

    @CreateDateColumn({ name: "create_time" })
    create_time: Date;

    @UpdateDateColumn({ name: "update_time", nullable: true })
    update_time: Date | null;

    @ManyToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
    user: User;
}
