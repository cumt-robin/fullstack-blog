这是通过 docker 运行项目的说明，如果你不使用 docker，请直接看 [legacy-ops](./legacy-ops.md) 文档。

## Docker 开发环境

1. 构建镜像

```shell
sh build-dev-images.sh
```

2. 运行 docker compose

```shell
docker compose -f compose-dev.yml up -d
```

## Docker 生产环境

1. 构建镜像

使用单独的命令：

```shell
docker build --target frontend -t fullstack-blog-frontend .

docker build --target backend -t fullstack-blog-backend .
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
docker tag fullstack-blog-frontend registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-frontend:3.0.0

docker tag fullstack-blog-backend registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-backend:3.0.0

# 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-frontend:3.0.0

docker push registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-backend:3.0.0
```

3. 登录服务器

4. 拉取镜像

```shell
docker login --username=xxx registry.cn-hangzhou.aliyuncs.com

docker pull registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-frontend:3.0.0

docker pull registry.cn-hangzhou.aliyuncs.com/tusi_personal/fullstack-blog-backend:3.0.0
```

5. 【仅首次】准备项目资源文件

新建一个目录用于存放生产环境的 compose.yml 等资源文件，比如`/home/docker/app/fullstack-blog`。

在这个目录下准备这些文件：

```
.
|-- backend
|   `-- config
|       |-- env.js
|       `-- prod.env.js
|-- compose.yml
`-- .env.docker.local

其中 compose.yml 内容参照项目中的 compose.yml。

.env.docker.local 文件参照下面内容：

```
DOCKER_REGISTRY=your_image_registry
DOCKER_NAMESPACE=your_registry_namespace
FRONTEND_VERSION=3.0.0
BACKEND_VERSION=3.0.0
```

`backend/config`目录下放置的是后端服务的一些配置，其中 `env.js`参照项目中的`app/backend/config/env.example.js`，其中 `prod.env.js`参照项目中的`app/backend/config/prod.env.example.js`。

6. 重新运行

```shell
docker compose --env-file .env.docker.local up -d
```

以上是分解步骤，相关命名以你的项目实际情况为准。

以上过程也可以由 CI/CD 完成，具体见 .github/workflows 目录。
