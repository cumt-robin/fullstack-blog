import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPushSubscriptionTable20260324093000 implements MigrationInterface {
    name = "AddPushSubscriptionTable20260324093000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`push_subscription\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`endpoint\` varchar(1000) NOT NULL,
                \`p256dh\` varchar(255) NOT NULL,
                \`auth\` varchar(255) NOT NULL,
                \`status\` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-active, 0-inactive',
                \`user_id\` int NULL,
                \`user_agent\` varchar(500) NULL,
                \`last_success_at\` datetime NULL,
                \`last_error_at\` datetime NULL,
                \`error_reason\` varchar(255) NULL,
                \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`update_time\` datetime NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`UQ_push_subscription_endpoint\` (\`endpoint\`(255)),
                KEY \`IDX_push_subscription_status\` (\`status\`),
                KEY \`IDX_push_subscription_user_id\` (\`user_id\`),
                CONSTRAINT \`FK_push_subscription_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS `push_subscription`");
    }
}
