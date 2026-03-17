import { MigrationInterface, QueryRunner } from "typeorm";
import * as marked from "marked";
import * as crypto from "crypto";

interface ArticleOutlineData {
    title: string;
    code: string;
    level: number;
    order: number;
    parent_id: number | null;
}

export class AddArticleOutline20260308141729 implements MigrationInterface {
    name = "AddArticleOutline20260308141729";

    private extractOutlinesFromMarkdown(markdownText: string): ArticleOutlineData[] {
        if (!markdownText) {
            return [];
        }

        const tokens = marked.lexer(markdownText);
        const outlines: ArticleOutlineData[] = [];
        const levelCounters: { [key: number]: number } = {};
        const parentStack: ArticleOutlineData[] = [];

        tokens.forEach((token: any) => {
            if (token.type === "heading") {
                const level = token.depth as number;
                const title = (token.text as string).trim();

                if (!levelCounters[level]) {
                    levelCounters[level] = 0;
                }
                levelCounters[level]++;

                for (let i = level + 1; i <= 6; i++) {
                    levelCounters[i] = 0;
                }

                while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= level) {
                    parentStack.pop();
                }

                const currentOrder = outlines.length + 1;
                const parent = parentStack.length > 0 ? parentStack[parentStack.length - 1] : null;

                const code = parent ? `${parent.code}-${levelCounters[level]}` : `${level}-${levelCounters[level]}`;

                const outline: ArticleOutlineData = {
                    title,
                    code,
                    level,
                    order: currentOrder,
                    parent_id: parent !== null ? parent.order : null,
                };

                outlines.push(outline);
                parentStack.push(outline);
            }
        });

        return outlines;
    }

    private calculateOutlineHash(outlines: ArticleOutlineData[]): string {
        if (!outlines || outlines.length === 0) {
            return "";
        }
        const outlineStr = JSON.stringify(
            outlines.map((o) => ({
                title: o.title,
                code: o.code,
                level: o.level,
                order: o.order,
                parent_id: o.parent_id,
            })),
        );
        return crypto.createHash("md5").update(outlineStr).digest("hex");
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasOutlineHashColumn = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'article' AND COLUMN_NAME = 'outline_hash'`,
        );
        console.log(hasOutlineHashColumn);
        // 这里的返回值是 [ { count: '0' } ]，需要转换为数字再比较
        if (Number(hasOutlineHashColumn[0].count) === 0) {
            await queryRunner.query(
                `ALTER TABLE \`article\` ADD \`outline_hash\` varchar(64) NULL COMMENT '提纲hash，用于对比避免不必要的重建'`,
            );
        }

        const hasOutlineTable = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'article_outline'`,
        );
        console.log(hasOutlineTable);
        if (Number(hasOutlineTable[0].count) === 0) {
            await queryRunner.query(`
                CREATE TABLE \`article_outline\` (
                    \`id\` int NOT NULL AUTO_INCREMENT,
                    \`article_id\` int NOT NULL COMMENT '文章id',
                    \`parent_id\` int NULL COMMENT '父级id',
                    \`title\` varchar(500) NOT NULL COMMENT '标题',
                    \`code\` varchar(50) NOT NULL COMMENT '锚点代码，格式：level-sublevel',
                    \`level\` int NOT NULL COMMENT '层级，从1开始',
                    \`order\` int NOT NULL COMMENT '排序',
                    \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    \`update_time\` datetime NULL,
                    PRIMARY KEY (\`id\`),
                    KEY \`article_id\` (\`article_id\`),
                    KEY \`parent_id\` (\`parent_id\`),
                    CONSTRAINT \`FK_article_outline_article\` FOREIGN KEY (\`article_id\`) REFERENCES \`article\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
                    CONSTRAINT \`FK_article_outline_parent\` FOREIGN KEY (\`parent_id\`) REFERENCES \`article_outline\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章提纲表'
            `);
        }

        await queryRunner.query(`DELETE FROM article_outline`);

        const articles = await queryRunner.query(`SELECT id, article_text FROM article WHERE deleted = 0`);

        for (const article of articles) {
            const outlines = this.extractOutlinesFromMarkdown(article.article_text);

            if (outlines.length === 0) {
                continue;
            }

            const sortedOutlines = [...outlines].sort((a, b) => a.order - b.order);
            const orderToIdMap = new Map<number, number>();

            for (const outlineData of sortedOutlines) {
                const result = await queryRunner.query(
                    `INSERT INTO article_outline (article_id, title, code, level, \`order\`, parent_id) VALUES (?, ?, ?, ?, ?, ?)`,
                    [article.id, outlineData.title, outlineData.code, outlineData.level, outlineData.order, null],
                );
                orderToIdMap.set(outlineData.order, result.insertId);
            }

            for (const outlineData of sortedOutlines) {
                if (outlineData.parent_id !== null && outlineData.parent_id !== undefined) {
                    const parentId = orderToIdMap.get(outlineData.parent_id);
                    if (parentId) {
                        const outlineId = orderToIdMap.get(outlineData.order);
                        if (outlineId) {
                            await queryRunner.query(`UPDATE article_outline SET parent_id = ? WHERE id = ?`, [parentId, outlineId]);
                        }
                    }
                }
            }

            const outlineHash = this.calculateOutlineHash(outlines);
            if (outlineHash) {
                await queryRunner.query(`UPDATE article SET outline_hash = ? WHERE id = ?`, [outlineHash, article.id]);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 删除 article_outline 表
        await queryRunner.query(`DROP TABLE IF EXISTS \`article_outline\``);

        // 删除 article 表的 outline_hash 字段
        await queryRunner.query(`ALTER TABLE \`article\` DROP COLUMN \`outline_hash\``);
    }
}
