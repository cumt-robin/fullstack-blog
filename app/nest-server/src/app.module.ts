import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { TagModule } from "./modules/tag/tag.module";
import { ArticleModule } from "./modules/article/article.module";
import { ValidatorModule } from "./modules/validator/validator.module";
import { UserModule } from "./modules/user/user.module";
import { AuthGuard } from "./guards/auth.guard";
import { APP_GUARD } from "@nestjs/core";

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
        ArticleModule,
        TagModule,
        ValidatorModule,
        UserModule,
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
