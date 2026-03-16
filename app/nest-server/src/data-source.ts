import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.development.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    username: "root",
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [resolve(process.cwd(), "src/entities/*.ts")],
    migrations: [resolve(process.cwd(), "src/migrations/*.ts")],
    synchronize: false,
};

export default new DataSource(dataSourceOptions);
