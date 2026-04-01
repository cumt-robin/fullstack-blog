import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserSessionAndPushDeviceId20260331090000 implements MigrationInterface {
    name = "AddUserSessionAndPushDeviceId20260331090000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`user_session\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`device_id\` varchar(128) NOT NULL,
                \`status\` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-active, 0-inactive',
                \`login_at\` datetime NULL,
                \`logout_at\` datetime NULL,
                \`last_seen_at\` datetime NULL,
                \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`update_time\` datetime NULL,
                PRIMARY KEY (\`id\`),
                KEY \`IDX_user_session_user_device_status\` (\`user_id\`, \`device_id\`, \`status\`),
                KEY \`IDX_user_session_device_status\` (\`device_id\`, \`status\`),
                CONSTRAINT \`FK_user_session_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        await queryRunner.query(`
            ALTER TABLE \`push_subscription\`
            ADD COLUMN \`device_id\` varchar(128) NOT NULL DEFAULT '' AFTER \`user_id\`
        `);

        await queryRunner.query(`
            ALTER TABLE \`push_subscription\`
            ADD KEY \`IDX_push_subscription_device_id\` (\`device_id\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`push_subscription\`
            DROP INDEX \`IDX_push_subscription_device_id\`
        `);

        await queryRunner.query(`
            ALTER TABLE \`push_subscription\`
            DROP COLUMN \`device_id\`
        `);

        await queryRunner.query("DROP TABLE IF EXISTS `user_session`");
    }
}
