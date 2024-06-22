// 请在同目录下新建一个 prod.env.js 配置文件，用于配置生产环境，配置说明如下。
module.exports = {
    mysql: {
        host: 'mysql host',
        port: 'mysql port, such as 3306',
        user: 'mysql username',
        password: 'mysql password',
        database: 'mysql database name',
        multipleStatements: true,
        waitForConnections: true,
        charset: "UTF8MB4_UNICODE_CI"
    },
}