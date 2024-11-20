import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { TagModule } from "./modules/tag/tag.module";
import { ArticleModule } from "./modules/article/article.module";
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [".env.development.local", ".env"],
            isGlobal: true,
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
        ArticleModule,
        TagModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
