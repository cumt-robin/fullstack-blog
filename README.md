# fullstack-blog ![release](https://img.shields.io/github/v/release/cumt-robin/fullstack-blog) ![license](https://img.shields.io/github/license/cumt-robin/fullstack-blog) ![stars](https://img.shields.io/github/stars/cumt-robin/fullstack-blog) ![building](https://img.shields.io/github/actions/workflow/status/cumt-robin/fullstack-blog/release.yml) ![lang](https://img.shields.io/github/languages/count/cumt-robin/fullstack-blog) ![commit](https://img.shields.io/github/last-commit/cumt-robin/fullstack-blog) ![release-date](https://img.shields.io/github/release-date/cumt-robin/fullstack-blog)

Hello，这是[Vue3+TS+Node打造个人博客](https://juejin.cn/column/7177402980180688952)开源全栈项目，最初采用 Vue3 + Vue CLI + Typescript + NodeJS Express 实现，目前已经涵盖了多种技术实现，无论你是 Webpack/Vite 使用者，或者是 Vue/React 爱好者，这里都有你想要的内容，你甚至可以从这里学会多种框架的使用。

除了最初采用的 Express，后端目前也提供了 NestJS 实现，并且后续会主要维护 NestJS 版本。

如果你是一个前端开发者，还不太清楚后端开发或者全栈的概念，请一定不要错过这个项目，我相信它会对你的工作或者求职有所帮助！

本项目最新代码采用 pnpm monorepo 架构搭建，工程化能力和开发体验都比较不错，目前支持：

- [x] Pnpm monorepo 架构，单仓库开发全栈项目的极致体验
- [x] Changeset：最先进的 monorepo 版本管理工具
- [x] Vite 支持：跟进最新的 Vue 生态
- [x] Prettier + ESLint + Stylelint 全项目支持，统一的代码风格，与低质量代码说拜拜
- [x] Commitizen: git cz 交互式提交
- [x] Commitlint: commit message 规范校验
- [x] Husky + lint-staged 代码入库质量检查
- [x] Docker Compose 开发和生产环境完整支持，一致的开发体验
- [x] Github Actions 支持，构建和部署全部自动化
- [x] unplugin-vue-components 支持识别和导入组件，按需加载

如果你需要找到旧版的前后端工程独立仓库代码，其中前端部分可以查看 2.X 版本，具体请查看[v2 分支](https://github.com/cumt-robin/fullstack-blog/tree/v2)。后端部分可以打开[express-blog-backend](https://github.com/cumt-robin/express-blog-backend)。

小程序源码是独立仓库维护的，可以打开[blog-weapp](https://github.com/cumt-robin/blog-weapp)。

## 在线体验

点击[Tusi博客](https://blog.wbjiang.cn/)体验一把。

## 相关博客

我写了一系列博客专栏，介绍如何使用 Vue3+TS+Node 打造个人博客。[点击前往专栏](https://juejin.cn/column/7177402980180688952)。

## Monorepo 介绍

为了让大部分前端开发者能够上手本项目，我们在 pnpm monorepo 支持了多种技术框架，你可以根据需要组合使用。

其中前端部分：

- [x] Vite + Vue3 + Pinia + TypeScript + Sentry: 见目录 app/vite-vue3，线上效果点击[blog.wbjiang.cn](https://blog.wbjiang.cn/)
- [x] Vue CLI + Vue3 + Vuex + TypeScript + SCSS: 见目录 app/webpack-vue3
- [x] CRA + React18 + TypeScript + React-Redux + Redux Toolkit + Tailwindcss + Styled Components: 见目录 app/cra-react18
- [x] Vite + React19 + TypeScript + Antd@6 + Zustand + Tailwindcss + Styled Components: 见目录 app/vite-react19
- [ ] Vite + Nuxt

后端部分：

- [x] NestJS + MySQL + TypeORM + class-validator: 见目录 app/nest-server
- [x] Express + MySQL + express-validator: 见目录 app/express-server

## Features

- 文章分页
- 文章详情
- 热门文章
- 分类及分类下文章
- 标签及标签下文章
- 留言板
- 文章评论区
- 文章时间轴
- 在线聊天室
- OpenAI聊天机器人
- JWT 认证（新版）
- Session 认证（旧版）
- 后台维护功能：文章管理，创作，评论管理及审核，留言管理及审核，分类管理，标签管理

## 全局依赖

```shell
pnpm add -g commitizen
```

## git 配置

Git 在提交代码时会将换行符从 CRLF（Windows 风格）转换为 LF（Unix 风格），但在检出（checkout）代码时不进行任何转换。这是一种适用于跨平台开发（Windows、Linux、macOS）的配置，用于在 Git 仓库中始终保持统一的 Unix 风格换行符 (LF)，同时确保本地文件在检出时保留原始的换行符。

```shell
git config core.autocrlf input
```

## 安装项目依赖

```shell
pnpm install
```

## 环境变量

针对 vite-vue3 工程，Sentry 涉及到私密信息 dsn 等，需要以环境变量提供。

开发环境下，在 vite-vue3 目录下新建 .env.local 文件，内容模板如下，请替换成你自己的 Sentry DSN：

```
VITE_APP_SENTRY_DSN=https://xxxxx.ingest.us.sentry.io/xxxxx
VITE_APP_SENTRY_ORG=xxx
VITE_APP_SENTRY_PROJECT=xxx
VITE_APP_SENTRY_TOKEN=xxx
```

项目打包时，如果是在本地打包，由于可以读取到 .env.local 文件，不需要再另外处理；

如果是在 CI/CD 中打包，需要通过环境变量指定 VITE_APP_SENTRY_DSN，

比如 github actions，需要在仓库的 Settings / Actions secrets and variables 中新增相关变量，比如 VITE_APP_SENTRY_DSN，

或者以 secrets 的方式定义，然后在 workflow 文件中通过 env 来引用 secrets.VITE_APP_SENTRY_DSN。

## 容器化运行项目【推荐】

见[docker-ops.md](./docker-ops.md)。

## 非容器化运行项目

见[legacy-ops.md](./legacy-ops.md)。

## web 前端部署

目前已采用云存储静态站点部署 + CDN加速

## 服务端部署

目前采用云服务器 Docker 容器化部署

## 联系我

如果有遇到其他问题，也可以[联系我](https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg)交流。

如果本项目对你工作或者求职有所帮助，请留下您的 star 多多支持我，免费开源不易，让这个项目帮到更多的人，多谢！

<img src="https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg" style="width:200px;height:200px" />

## 反馈建议

如果你对本项目有一些建议或者想法，可以在[issue](https://github.com/cumt-robin/fullstack-blog/issues)提出，非常感谢！

## 贡献者

<a href="https://github.com/cumt-robin/fullstack-blog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=cumt-robin/fullstack-blog" />
</a>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=cumt-robin/fullstack-blog&type=Date)](https://star-history.com/#cumt-robin/fullstack-blog&Date)
