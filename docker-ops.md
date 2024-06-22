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