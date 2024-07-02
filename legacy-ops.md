这是通过常规方式运行项目的说明，如果你要使用 docker，请直接看 [docker-ops](./docker-ops.md) 文档。

## 开发环境

安装依赖：

```shell
pnpm install
```

由于不是使用 docker compose，需要修改`vue.config.js`中的`devServer`配置：

```
target: "http://localhost:8002",
```

启动项目：

```shell
pnpm run fullstack:dev
```

## 生产环境

前端部分，打包好资源 scp 到服务器。

后端部分，通过 pm2 deploy 部署到服务器，并重启相关服务。

以上都可以用脚本配合 CI/CD 工具实现，具体可以参考这篇文章《[前端上手全栈自动化部署，让你看起来像个“高手”](https://juejin.cn/post/7373488886461431860)》。
