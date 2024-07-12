# fullstack-blog ![release](https://img.shields.io/github/v/release/cumt-robin/fullstack-blog) ![license](https://img.shields.io/github/license/cumt-robin/fullstack-blog) ![stars](https://img.shields.io/github/stars/cumt-robin/fullstack-blog) ![building](https://img.shields.io/github/actions/workflow/status/cumt-robin/fullstack-blog/release.yml) ![lang](https://img.shields.io/github/languages/count/cumt-robin/fullstack-blog) ![commit](https://img.shields.io/github/last-commit/cumt-robin/fullstack-blog) ![release-date](https://img.shields.io/github/release-date/cumt-robin/fullstack-blog)

Hello，这是[Vue3+TS+Node打造个人博客](https://juejin.cn/column/7177402980180688952)开源全栈项目，采用 Vue3 + Typescript + NodeJS Express 实现。如果你是一个前端开发者，还不太清楚后端开发或者全栈的概念，请一定不要错过这个项目，我相信它会对你的工作或者求职有所帮助！

本项目最新代码采用 pnpm monorepo 架构搭建，工程化能力和开发体验都比较不错，目前支持：

- [x] Pnpm monorepo 架构，单仓库开发全栈项目的极致体验
- [x] Changeset：最先进的 monorepo 版本管理工具
- [x] Vite 支持：跟进最新的 Vue 生态
- [x] Prettier + ESLint + Stylelint 代码质量与风格
- [x] Commitizen: git cz 交互式提交
- [x] Commitlint: commit message 规范校验
- [x] Husky + lint-staged 代码入库质量检查
- [x] Docker Compose 开发和生产环境完整支持，一致的开发体验
- [x] Github Actions 支持，构建和部署全部自动化

如果你需要找到旧版的前后端工程独立仓库代码，其中前端部分可以查看 2.X 版本，具体请查看[v2 分支](https://github.com/cumt-robin/fullstack-blog/tree/v2)。后端部分可以打开[express-blog-backend](https://github.com/cumt-robin/express-blog-backend)。

小程序源码是独立仓库维护的，可以打开[blog-weapp](https://github.com/cumt-robin/blog-weapp)。

## 在线体验

点击[Tusi博客](https://blog.wbjiang.cn/)体验一把。

## 相关博客

我写了一系列博客专栏，介绍如何使用 Vue3+TS+Node 打造个人博客。[点击前往专栏](https://juejin.cn/column/7177402980180688952)。

## Monorepo 介绍

我们在 pnpm monorepo 支持了多种技术框架，你可以根据需要组合使用。

其中前端部分：

- [x] Vite + Vue3 + Pinia: 见目录 app/vite-vue3，线上效果点击[blog.wbjiang.cn](https://blog.wbjiang.cn/)
- [x] Vue CLI + Vue3 + Vuex: 见目录 app/webpack-vue3，线上效果点击[webpack-vue3-blog.wbjiang.cn](https://webpack-vue3-blog.wbjiang.cn/)
- [ ] CRA + React
- [ ] Vite + React
- [ ] Vite + Nuxt

后端部分：

- [x] Express + MySQL: 见目录 app/express-server
- [ ] NestJS 开发中...

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

```shell
git config core.autocrlf input
```

## 安装项目依赖

```shell
pnpm install
```

## 容器化运行项目【推荐】

见[docker-ops.md](./docker-ops.md)。

## 非容器化运行项目

见[legacy-ops.md](./legacy-ops.md)。

## 联系我

如果有遇到其他问题，也可以[联系我](https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg)交流。

如果本项目对你工作或者求职有所帮助，请留下您的 star 多多支持我，免费开源不易，让这个项目帮到更多的人，多谢！

<img src="https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg" style="width:200px;height:200px" />

## 反馈建议

如果你对本项目有一些建议或者想法，可以在[issue](https://github.com/cumt-robin/fullstack-blog/issues)提出，非常感谢！

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=cumt-robin/fullstack-blog&type=Date)](https://star-history.com/#cumt-robin/fullstack-blog&Date)
