// 请在同目录下新建一个 dev.env.js 配置文件，用于配置开发环境，配置说明如下。
module.exports = {
    allowClient: ["localhost:3000", "127.0.0.1:3000"],
    mysql: {
        host: "localhost（如果是docker运行，直接填mysql）",
        port: "3306",
        user: "root",
        password: "your mysql password",
        database: "blog_db",
    },
};
