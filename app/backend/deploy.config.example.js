// 请在同目录下新建一个 deploy.config.js 配置文件，配置说明如下。
module.exports = {
    production : {
       "user" : "部署服务器的用户名",
       "host" : ["部署服务器的IP"],
       "ref"  : "仓库分支，例如origin/main",
       "repo" : "https://github.com/cumt-robin/express-blog-backend.git",
       "path" : "部署服务器路径，比如/home/xxx/backend/express-blog-backend",
       "post-setup": "npm install -g pm2 && npm install && npm start-prod",
       "post-deploy": "git pull && npm install && pm2 restart blog"
    }
}