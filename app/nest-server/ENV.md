## 准备环境变量

开发环境可以准备一个`.env.development.local`文件，内容如下：

```
PORT=8012
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=xxx
MYSQL_DATABASE=blog_db
JWT_SECRET=xxx
EMAIL_USER=xxx@163.com
EMAIL_PASS=xxx
BLOG_NAME=Tusi博客
AUTHOR_EMAIL=xxx
SITE_URL=https://blog.wbjiang.cn
OPENAI_API_KEY=xxx
WEB_SOCKET_WHITE_LIST=http://localhost:3000,http://127.0.0.1:3000
```

## 生产环境见 docker-ops.md
