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
import { AuthModule } from "./modules/auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env.development.local", ".env"],
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE_NAME,
            autoLoadEntities: true,
            // entities: [__dirname + "/entities/*.ts"],
        }),
        AuthModule,
        ArticleModule,
        TagModule,
        ValidatorModule,
        UserModule,
        CategoryModule,
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
