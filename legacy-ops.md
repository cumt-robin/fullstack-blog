这是通过常规方式运行项目的说明，如果你要使用 docker，请直接看 [docker-ops](./docker-ops.md) 文档。

## 开发环境

安装依赖：

```shell
pnpm install
```

由于不是使用 docker-compose，需要修改`vue.config.js`中的`devServer`配置：

```
target: "http://localhost:8002",
```

启动项目：

```shell
pnpm run fullstack:dev
```

## 生产环境