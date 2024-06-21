# express-blog-backend ![release](https://img.shields.io/github/v/release/cumt-robin/express-blog-backend) ![license](https://img.shields.io/github/license/cumt-robin/express-blog-backend) ![stars](https://img.shields.io/github/stars/cumt-robin/express-blog-backend) ![building](https://img.shields.io/github/actions/workflow/status/cumt-robin/express-blog-backend/ci_cd.yml) ![lang](https://img.shields.io/github/languages/count/cumt-robin/express-blog-backend) ![commit](https://img.shields.io/github/last-commit/cumt-robin/express-blog-backend) ![release-date](https://img.shields.io/github/release-date/cumt-robin/express-blog-backend)

Hello，这是[Vue3+TS+Node打造个人博客](https://juejin.cn/column/7177402980180688952)开源全栈项目的后端部分，采用 Nodejs 实现，应用框架是 Express。

如果您需要找到前端源码，可以打开[vue3-ts-blog-frontend](https://github.com/cumt-robin/vue3-ts-blog-frontend)。

如果您需要找到小程序源码，可以打开[blog-weapp](https://github.com/cumt-robin/blog-weapp)。

## 相关博客

我写了一系列博客专栏，介绍如何使用 Vue3+TS+Node 打造个人博客。[点击前往专栏](https://juejin.cn/column/7177402980180688952)。

## 了解后端架构

针对该项目的后端部分，专门写了一篇博客介绍，可以先打开了解一下。

[Vue3+TS+Node打造个人博客（后端架构）](https://juejin.cn/post/7072903323128594462)

## 配置文件，必看

因为后端项目通常涉及到一些私密信息，比如密钥、密码等，这些信息不适合在开源项目中公开。

你需要补充 dev.env.js, env.js, prod.env.js, deploy.config.js 四个文件，才能正常启动这个项目。

这些文件有对应的 example 文件示例，你可以参照着修改成自己需要的。

比如，参照 dev.env.example.js，修改成 dev.env.js 文件。

有些不清楚的配置字段可以留空，但是必须要有对应的字段，保证程序能运行起来。最后调试过程中发现缺什么，再补充什么。

## 数据库配置

联系我获取数据库初始化脚本，然后导入到自己的 MySQL 数据库中。

## 前置依赖

如果您不是通过 Docker 启动项目，需要先安装 pm2。

```
npm install pm2 -g
```

## 开发环境启动项目

启动命令：

```
npm run dev
```

## 生产环境

启动服务：

```
npm run start-prod
```

自动化部署参考这篇文章《[前端上手全栈自动化部署，让你看起来像个“高手”](https://juejin.cn/post/7373488886461431860)》。

## Docker 运行和部署

见[README.Docker.md](./README.Docker.md)

## 资料 & 交流

本项目依赖数据库 MySQL，相关数据库初始化脚本我上传到网盘了，请[联系我](https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg)获取。

如果有遇到其他问题，也可以[联系我](https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg)。

希望本项目对你有帮助，欢迎 star。

<img src="https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg" style="width:200px;height:200px" />

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=cumt-robin/express-blog-backend&type=Date)](https://star-history.com/#cumt-robin/express-blog-backend&Date)
