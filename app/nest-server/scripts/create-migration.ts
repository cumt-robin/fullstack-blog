import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error("Usage: pnpm migration:new <MigrationName>");
    console.error("Example: pnpm migration:new AddUserAvatar");
    process.exit(1);
}

const migrationName = args[0];
const now = new Date();
const timestamp =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0");

const className = `${migrationName}${timestamp}`;
const fileName = `${timestamp}-${migrationName}.ts`;
const outputPath = resolve(process.cwd(), "src/migrations", fileName);

const template = `import { MigrationInterface, QueryRunner } from "typeorm";

export class ${className} implements MigrationInterface {
    name = "${className}";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // TODO: 添加你的迁移逻辑
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // TODO: 添加回滚逻辑
    }
}
`;

const migrationsDir = dirname(outputPath);
if (!existsSync(migrationsDir)) {
    mkdirSync(migrationsDir, { recursive: true });
}

writeFileSync(outputPath, template, "utf-8");
console.log(`Migration created: ${fileName}`);
console.log(`Path: ${outputPath}`);
