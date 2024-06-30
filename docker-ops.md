这是通过 docker 运行项目的说明，如果你不使用 docker，请直接看 [legacy-ops](./legacy-ops.md) 文档。

## Docker 开发环境

1. 构建镜像

```shell
sh build-dev-images.sh
```

2. 运行 docker-compose

```shell
docker-compose -f compose-dev.yml up -d
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
docker-compose build
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

5. 重新运行

```shell
docker-compose up -d
```
