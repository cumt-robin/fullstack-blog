import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { TagModule } from "./modules/tag/tag.module";
import { ArticleModule } from "./modules/article/article.module";
import { ValidatorModule } from "./modules/validator/validator.module";
import { UserModule } from "./modules/user/user.module";
import { AuthGuard } from "./guards/auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { CategoryModule } from "./modules/category/category.module";
import { CommentModule } from "./modules/comment/comment.module";
import { ReplyModule } from "./modules/reply/reply.module";
import { CommonModule } from "./modules/common/common.module";
import { BannerModule } from "./modules/banner/banner.module";
import { ChatgptModule } from "./modules/chatgpt/chatgpt.module";
import { ChatModule } from "./modules/chat/chat.module";

const isProduction = process.env.NODE_ENV === "production";
const migrationExt = isProduction ? "js" : "ts";

@Module({
    imports: [
        CommonModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env.development.local", ".env.production.local", ".env"],
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT),
            username: "root",
            password: process.env.MYSQL_ROOT_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            autoLoadEntities: true,
            migrations: [__dirname + `/migrations/*.${migrationExt}`],
            migrationsRun: true,
        }),
        ArticleModule,
        TagModule,
        ValidatorModule,
        UserModule,
        CategoryModule,
        CommentModule,
        ReplyModule,
        BannerModule,
        ChatgptModule,
        ChatModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
