// 请在同目录下新建一个 dev.env.js 配置文件，用于配置开发环境，配置说明如下。
module.exports = {
    allowClient: ["localhost:3000", "127.0.0.1:3000"],
    mysql: {
        host: 'localhost',
        port: '3306',
        user: 'your mysql username',
        password: 'your mysql password',
        database: 'your mysql database name',
        multipleStatements: true,
        waitForConnections: true,
        charset: "UTF8MB4_UNICODE_CI"
    },
}