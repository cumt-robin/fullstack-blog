import { User } from "@/entities/User";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Index("UQ_push_subscription_endpoint", ["endpoint"], { unique: true })
@Index("IDX_push_subscription_status", ["status"], {})
@Index("IDX_push_subscription_user_id", ["user_id"], {})
@Index("IDX_push_subscription_device_id", ["device_id"], {})
@Entity("push_subscription", { schema: "blog_db" })
export class PushSubscription {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "endpoint", length: 1000 })
    endpoint: string;

    @Column("varchar", { name: "p256dh", length: 255 })
    p256dh: string;

    @Column("varchar", { name: "auth", length: 255 })
    auth: string;

    @Column("tinyint", { name: "status", width: 1, default: () => 1, comment: "1-active, 0-inactive" })
    status: 0 | 1;

    @Column("int", { name: "user_id", nullable: true })
    user_id: number | null;

    @Column("varchar", { name: "device_id", length: 128 })
    device_id: string;

    @Column("varchar", { name: "user_agent", nullable: true, length: 500 })
    user_agent: string | null;

    @Column("datetime", { name: "last_success_at", nullable: true })
    last_success_at: Date | null;

    @Column("datetime", { name: "last_error_at", nullable: true })
    last_error_at: Date | null;

    @Column("varchar", { name: "error_reason", nullable: true, length: 255 })
    error_reason: string | null;

    @CreateDateColumn({ name: "create_time" })
    create_time: Date;

    @UpdateDateColumn({ name: "update_time", nullable: true })
    update_time: Date | null;

    @ManyToOne(() => User, { onDelete: "SET NULL", onUpdate: "CASCADE" })
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
    user: User | null;
}
