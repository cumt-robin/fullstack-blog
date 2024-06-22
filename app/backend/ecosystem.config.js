const deployConfig = require("./deploy.config")

module.exports = {
    /**
    * Application configuration section
    * http://pm2.keymetrics.io/docs/usage/application-declaration/
    */
    apps: [
        // First application
        {
            // 应用名
            name: 'blog',
            // 启动脚本
            script: 'src/app.js',
            // –env参数指定运行的环境
            env_production: {
                NODE_ENV: 'production',
                PORT: 8002,
            },
        }
    ],
    /**
    * Deployment section
    * http://pm2.keymetrics.io/docs/usage/deployment/
    */
    deploy: deployConfig
};