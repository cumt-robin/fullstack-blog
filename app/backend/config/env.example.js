// 请在同目录下新建一个 env.js 配置文件，用于配置通用设置，配置说明如下。
module.exports = {
    allowClient: [],
    email: {
        service: '163', // 邮箱服务商
        port: 465, // SMTP 端口
        secureConnection: true, // 使用 SSL
        auth: {
            user: 'your email used for sending notifications',
            // smtp授权码
            pass: 'smtp auth code'
        }
    },
    authorEmail: 'your private email which is used for receiving notifications',
    blogName: 'your blog name, such as Tusi博客',
    siteURL: 'visit url of your blog, such as https://blog.me',
    chatgpt: {
        key: 'your OPENAI_API_KEY'
    },
    jwt: {
        secret: 'your jwt secret, you must change it to your own',
        expireDays: 3,
    }
}