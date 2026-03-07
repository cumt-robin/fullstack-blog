import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestampColumnsToAllTables20260307114624 implements MigrationInterface {
    name = "AddTimestampColumnsToAllTables20260307114624";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tables = [
            { name: "user", hasTimestamp: false },
            { name: "banner", hasTimestamp: false },
            { name: "role", hasTimestamp: false },
            { name: "authority", hasTimestamp: false },
            { name: "role_auth", hasTimestamp: false },
            { name: "article_tag", hasTimestamp: false },
            { name: "article_category", hasTimestamp: false },
        ];

        for (const table of tables) {
            const hasCreateTime = await this.columnExists(queryRunner, table.name, "create_time");
            const hasUpdateTime = await this.columnExists(queryRunner, table.name, "update_time");

            if (!hasCreateTime) {
                await queryRunner.query(`ALTER TABLE \`${table.name}\` ADD \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            }
            if (!hasUpdateTime) {
                // update_time 支持 NULL，用于判断记录是否被更新过
                await queryRunner.query(`ALTER TABLE \`${table.name}\` ADD \`update_time\` datetime NULL`);
            }
        }

        const existingTables = [
            { name: "article", hasTimestamp: true },
            { name: "category", hasTimestamp: true },
            { name: "tag", hasTimestamp: true },
            { name: "comments", hasTimestamp: true },
            { name: "reply", hasTimestamp: true },
        ];

        for (const table of existingTables) {
            const hasCreateTime = await this.columnExists(queryRunner, table.name, "create_time");
            const hasUpdateTime = await this.columnExists(queryRunner, table.name, "update_time");

            if (hasCreateTime) {
                await queryRunner.query(`ALTER TABLE \`${table.name}\` MODIFY \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            }
            if (hasUpdateTime) {
                // update_time 支持 NULL
                await queryRunner.query(`ALTER TABLE \`${table.name}\` MODIFY \`update_time\` datetime NULL`);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tables = ["user", "banner", "role", "authority", "role_auth", "article_tag", "article_category"];

        for (const table of tables) {
            const hasUpdateTime = await this.columnExists(queryRunner, table, "update_time");
            const hasCreateTime = await this.columnExists(queryRunner, table, "create_time");

            if (hasUpdateTime) {
                await queryRunner.query(`ALTER TABLE \`${table}\` DROP COLUMN \`update_time\``);
            }
            if (hasCreateTime) {
                await queryRunner.query(`ALTER TABLE \`${table}\` DROP COLUMN \`create_time\``);
            }
        }
    }

    private async columnExists(queryRunner: QueryRunner, tableName: string, columnName: string): Promise<boolean> {
        const result = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
            [tableName, columnName],
        );
        return result[0].count > 0;
    }
}
