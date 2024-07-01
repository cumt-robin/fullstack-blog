# fullstack-blog ![release](https://img.shields.io/github/v/release/cumt-robin/vue3-ts-blog-frontend) ![license](https://img.shields.io/github/license/cumt-robin/vue3-ts-blog-frontend) ![stars](https://img.shields.io/github/stars/cumt-robin/vue3-ts-blog-frontend) ![building](https://img.shields.io/github/actions/workflow/status/cumt-robin/vue3-ts-blog-frontend/ci_cd.yml) ![lang](https://img.shields.io/github/languages/count/cumt-robin/vue3-ts-blog-frontend) ![commit](https://img.shields.io/github/last-commit/cumt-robin/vue3-ts-blog-frontend) ![release-date](https://img.shields.io/github/release-date/cumt-robin/vue3-ts-blog-frontend)

Hello，这是[Vue3+TS+Node打造个人博客](https://juejin.cn/column/7177402980180688952)开源全栈项目，采用 Vue3 + Typescript + NodeJS Express 实现。

最新代码采用 pnpm monorepo 架构搭建，工程化能力和开发体验都比较不错。

支持：

- [x] pnpm monorepo 架构，单仓库开发全栈项目的极致体验
- [x] changeset 最先进的 monorepo 版本管理工具
- [x] Prettier + ESLint + Stylelint 代码质量与风格
- [x] Commitizen git cz 交互式提交
- [x] commitlint commit message 规范校验
- [x] Husky + lint-staged 代码入库质量检查
- [x] Docker Compose 开发和生产环境完整支持，一致的开发体验
- [x] Github Actions 支持，构建和部署全部自动化


如果你需要找到旧版的前后端工程独立仓库代码，其中前端部分可以查看 2.X 版本，具体请查看[v2 分支](https://github.com/cumt-robin/fullstack-blog/tree/v2)。后端部分可以打开[express-blog-backend](https://github.com/cumt-robin/express-blog-backend)。

小程序源码是独立仓库维护的，可以打开[blog-weapp](https://github.com/cumt-robin/blog-weapp)。

## 在线体验

点击[Tusi博客](https://blog.wbjiang.cn/)体验一把。

## 相关博客

我写了一系列博客专栏，介绍如何使用 Vue3+TS+Node 打造个人博客。[点击前往专栏](https://juejin.cn/column/7177402980180688952)。

## 全局依赖

```shell
pnpm add -g commitizen
```

## git 配置

```shell
git config core.autocrlf input
```

## 容器化运行项目【推荐】

见[docker-ops.md](./docker-ops.md)。

## 非容器化运行项目

见[legacy-ops.md](./legacy-ops.md)。

## 联系我

如果有遇到其他问题，也可以[联系我](https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg)。

希望本项目对你有帮助，欢迎 star。

<img src="https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_new.jpg" style="width:200px;height:200px" />

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=cumt-robin/vue3-ts-blog-frontend&type=Date)](https://star-history.com/#cumt-robin/vue3-ts-blog-frontend&Date)
