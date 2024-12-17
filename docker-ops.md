这是通过 docker 运行项目的说明，如果你不使用 docker，请直接看 [legacy-ops](./legacy-ops.md) 文档。

## 数据库准备

关注公众号[程序员白彬](https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg)，回复关键词【博客数据库脚本】获取初始 MySQL 脚本。

将脚本放置在项目工程的 mysql/init-scripts 目录下。

```
|-- mysql
|   `-- init-scripts
|       |-- init.sql
```

## Docker 开发环境

前端均支持 Docker 开发环境。

后端暂时只支持 express-server。nest-server 由于文件更新检测问题，暂时无法支持 Docker 开发环境，后续再投入时间研究补充。

构建镜像：

```shell
sh build-dev-images.sh
```

启动服务：

```shell
docker compose --env-file .env.docker.local -f compose-dev.yml up -d
```

其中的`.env.docker.local`文件内容参照下面内容：

```
MYSQL_ROOT_PASSWORD=xxx
MYSQL_DATABASE=blog_db
```

## Docker 生产环境

1. 构建镜像

使用单独的命令：

```shell
docker build --target vite-vue3-frontend -t fullstack-blog-vite-vue3 .

docker build --target nestjs-backend -t fullstack-blog-nest .
```

使用 docker compose

```shell
docker compose build
```

2. 上传镜像

```shell
# 先登录
docker login --username=xxx registry.cn-hangzhou.aliyuncs.com

# 打 tag
docker tag fullstack-blog-vite-vue3 registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-vite-vue3:3.0.0

docker tag fullstack-blog-nest registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-nest:3.0.0

# 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-vite-vue3:3.0.0

docker push registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-nest:3.0.0
```

3. 登录服务器

4. 拉取镜像

```shell
docker login --username=xxx registry.cn-hangzhou.aliyuncs.com

docker pull registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-vite-vue3:3.0.0

docker pull registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-nest:3.0.0
```

5. 【仅首次】准备项目资源文件

新建一个目录用于存放生产环境的 compose.yml 等资源文件，比如`/home/docker/app/fullstack-blog`。

在这个目录下准备这些文件：

```
.
|-- nest-server
|   `-- .env.production.local
|-- compose.yml
`-- .env.docker.local
```

其中 compose.yml 内容参照项目中的 compose.yml。

.env.docker.local 文件参照下面内容：

```
DOCKER_REGISTRY=your_image_registry
DOCKER_NAMESPACE=your_registry_namespace
VITE_VUE3_VERSION=1.0.4
WEBPACK_VUE3_VERSION=3.7.1
NEST_SERVER_VERSION=3.5.0
MYSQL_DATABASE=blog_db
MYSQL_ROOT_PASSWORD=xxx
```

`nest-server/.env.production.local`文件是 Nest 后端服务的配置文件，内容参照下方：

```
MYSQL_HOST=mysql
MYSQL_PORT=3306
JWT_SECRET=xxx
EMAIL_USER=xxx@163.com
EMAIL_PASS=xxx
BLOG_NAME=Tusi博客
AUTHOR_EMAIL=xxx
SITE_URL=https://blog.wbjiang.cn
OPENAI_API_KEY=xxx
WEB_SOCKET_WHITE_LIST=https://blog.wbjiang.cn
```

6. 重新运行

```shell
docker compose --env-file .env.docker.local up -d
```

以上是分解步骤，相关命名以你的项目实际情况为准。

以上过程也可以由 CI/CD 完成，具体见 .github/workflows 目录。

## 本地测试生产环境 Docker 镜像

1. 打镜像

```shell
docker compose --env-file .env.docker.local -f compose-prod-local.yml build
```

2. 运行镜像测试

```shell
docker compose --env-file .env.docker.local -f compose-prod-local.yml up -d
```
