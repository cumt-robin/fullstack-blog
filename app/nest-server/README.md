<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Database Migration

本项目使用 TypeORM Migration 管理数据库变更。

### 配置说明

- **配置文件**: `data-source.ts` - TypeORM CLI 数据源配置
- **Migration 目录**: `src/migrations/` - 存放所有迁移文件
- **自动执行**: `app.module.ts` 中已配置 `migrationsRun: true`，应用启动时自动执行 pending 的 migration

### 为什么设计 `typeorm` 基础命令

```json
"typeorm": "tsx ./node_modules/typeorm/cli.js --dataSource src/data-source.ts"
```

这个命令设计遵循 **DRY（Don't Repeat Yourself）原则**，作为所有 TypeORM CLI 操作的统一入口。

#### 设计原因

1. **避免重复配置**
   - 如果不使用基础命令，每个 migration 命令都需要重复配置 `--dataSource` 参数
   - 修改配置时需要同时修改多处，容易遗漏

2. **简化命令调用**
   - 其他命令通过 `pnpm typeorm` 间接调用，保持简洁
   - 如 `migration:generate` 实际执行 `tsx ./node_modules/typeorm/cli.js --dataSource src/data-source.ts migration:generate`

3. **便于维护**
   - 修改数据源配置只需改一处
   - 切换 TypeScript 执行器（如从 ts-node 改为 tsx）只需改基础命令

#### 命令对比

| 设计方式 | 配置复杂度 | 维护难度 |
|---------|------------|---------|
| ❌ 每个命令独立配置 | 高（重复代码） | 难（多处修改） |
| ✅ 统一基础命令 | 低（复用代码） | 易（一处修改） |

#### 实际调用链

```
pnpm migration:generate
    ↓
调用 "typeorm" 基础命令
    ↓
tsx ./node_modules/typeorm/cli.js --dataSource src/data-source.ts
    ↓
追加子命令: migration:generate
    ↓
完整命令: tsx ./node_modules/typeorm/cli.js --dataSource src/data-source.ts migration:generate
```

### 可用命令

```bash
# 适用于手动编写 migration 文件。创建空的 migration 文件（文件名格式：年月日时分秒-名称.ts）
pnpm migration:new AddUserAvatar
# 生成文件：src/migrations/20260307114114-AddUserAvatar.ts
# 如果用 migration:create 生成的文件，生成的是时间戳格式开头的，不够直观。

# 适用于自动编写 migration 文件。生成 migration 文件（对比 entities 和数据库的差异）
pnpm migration:generate ./src/migrations/AddTimestampColumns

# 手动执行所有 pending migrations（通常不需要，启动应用会自动执行）
pnpm migration:run

# 回滚最近一次执行的 migration
pnpm migration:revert

# 查看当前数据库 schema
pnpm typeorm schema:log
```

### 工作流程

```bash
# 1. 修改 entity 定义
# src/entities/User.ts
@CreateDateColumn({ name: "create_time" })
create_time: Date;

@UpdateDateColumn({ name: "update_time" })
update_time: Date;

# 2. 创建 migration 文件
pnpm migration:new AddTimestampColumns
# 生成文件：src/migrations/20260307114114-AddTimestampColumns.ts

# 3. 编写 migration 逻辑（或使用 migration:generate 自动生成）
# 编辑 src/migrations/20260307114114-AddTimestampColumns.ts

# 4. 如果不希望自己编写 migration 文件，也可以使用 migration:generate 自动生成 migration 文件
pnpm migration:generate ./src/migrations/AddTimestampColumns

# 5. 重启应用，自动执行 migration
pnpm run start:dev
```

### 最佳实践

1. **每次修改 entity 后生成新的 migration**，保持数据库变更可追溯
2. **不要手动修改已执行的 migration 文件**，如需变更请生成新的 migration
3. **生产环境部署前先在测试环境验证 migration**
4. **使用有意义的 migration 名称**，如 `AddUserAvatar`、`RemoveDeprecatedField`
5. **开发环境可以使用 `migrationsRun: true` 自动执行**，生产环境建议手动执行并验证

### Migration 文件结构

```typescript
// src/migrations/20260307114114-AddUserAvatar.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAvatar20260307114114 implements MigrationInterface {
    name = "AddUserAvatar20260307114114";

    // 应用迁移（执行变更）
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    // 回滚迁移（撤销变更）
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }
}
```

### 生产环境同步

生产环境数据库同步步骤：

```bash
# 1. 确保 migration 文件已提交到代码仓库
git add src/migrations/
git commit -m "feat: add timestamp columns migration"

# 2. 生产环境部署时执行 migration
# 方式一：手动执行（推荐）
pnpm migration:run

# 方式二：应用启动时自动执行
# app.module.ts 中已配置 migrationsRun: true
# 部署新代码后重启应用即可

# 3. 验证 migration 执行成功
pnpm typeorm schema:log
```

**生产环境注意事项**：

1. **备份数据库**：执行 migration 前务必备份
2. **先在测试环境验证**：确保 migration 正确无误
3. **低峰期执行**：避免影响线上服务
4. **监控执行日志**：关注是否有报错

### 常见问题

**Q: Migration 执行失败怎么办？**

```bash
# 1. 检查错误日志
# 2. 手动修复数据库（如删除已添加的列）
# 3. 删除 migrations 表中的记录
DELETE FROM migrations WHERE name = 'FailedMigrationName';
# 4. 修复 migration 文件后重新执行
```

**Q: 如何查看已执行的 migration？**

```bash
# 查询数据库中的 migrations 表
SELECT * FROM migrations ORDER BY id DESC;
```

**Q: 开发环境和生产环境数据库结构不一致？**

```bash
# 1. 对比 schema 差异
pnpm typeorm schema:log

# 2. 生成新的 migration 同步差异
pnpm migration:generate ./src/migrations/SyncSchema
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
