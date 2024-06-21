## Docker 搭建开发环境

参照 README.md 文件中的说明，补充好 dev.env.js, env.js 两个文件。

1. 打镜像

```
docker build -f Dockerfile.dev -t blog-express-dev .
```

2. 运行容器

```
docker run -dp 8002:8002 \
--mount type=bind,source=${PWD},target=/app \
--name blog-backend-dev \
blog-express-dev
```

## Docker 生产环境部署

登录你的服务器后，准备好两个配置文件，文件所处的位置可以自定义，分别用于挂载到 config/env.js 和 config/prod.env.js，内容参考 example 文件。

```
docker run -dp 8002:8080 \
-v /home/robin/docker/mounts/blog-express/env.js:/app/config/env.js \
-v /home/robin/docker/mounts/blog-express/prod.env.js:/app/config/prod.env.js \
--name blog-backend \
--restart always \
registry.cn-hangzhou.aliyuncs.com/tusi_personal/blog-express:2.0.1
```

具体部署和自动化流程参考[轻松学会 Nodejs Express 项目 Docker 部署]()