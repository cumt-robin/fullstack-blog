/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const theme = require("./antd-theme.js");

// function addStyleResource(rule) {
//     rule.use("style-resource")
//         .loader("style-resources-loader")
//         .options({
//             patterns: [path.resolve(__dirname, "./src/styles/preload.scss")],
//         });
// }

module.exports = {
    publicPath: "/",
    devServer: {
        port: 3000,
        open: true,
        proxy: {
            "/api": {
                target: "https://blog.wbjiang.cn",
                changeOrigin: true,
                // pathRewrite: {
                //     "^/api": "",
                // },
            },
        },
    },
    chainWebpack: (config) => {
        // html-webpack-plugin
        config.plugin("html").tap((args) => {
            args[0].title = process.env.VUE_APP_TITLE;
            return args;
        });

        // 本来打算使用 style-resources-loader 自动注入scss,但是发现对 element 使用的一些 sass 特性支持有点问题
        // const types = ["vue-modules", "vue", "normal-modules", "normal"];
        // types.forEach((type) => addStyleResource(config.module.rule("scss").oneOf(type)));

        // 这里改用 sass-resources-loader 注入scss
        const oneOfsMap = config.module.rule("scss").oneOfs.store;
        oneOfsMap.forEach((item) => {
            item.use("sass-resources-loader")
                .loader("sass-resources-loader")
                .options({
                    // Provide path to the file with resources
                    resources: path.resolve(__dirname, "./src/styles/preload.scss"),
                    hoistUseStatements: true,
                })
                .end();
        });

        // preload 处理, tap 可以返回一个新的配置
        config.plugin("preload").tap((args) => {
            // runtime 做了内联,这里不做 preload
            args[0].fileBlacklist.push(/runtime\..*\.js$/);
            return args;
        });

        // 移除 prefetch 插件
        config.plugins.delete("prefetch");

        // 去除掉多余的moment语言包
        config.plugin("context-replacement").use(require.resolve("webpack/lib/ContextReplacementPlugin"), [/moment[/\\]locale$/, /zh-cn/]);

        // production env
        config.when(
            process.env.NODE_ENV === "production",
            (config) => {
                // 生产环境

                // devtool设置
                config.devtool("nosources-source-map");

                // 内联 runtimeChunk
                config
                    .plugin("ScriptExtHtmlWebpackPlugin")
                    .after("html")
                    .use("script-ext-html-webpack-plugin", [
                        {
                            inline: /runtime\..*\.js$/,
                        },
                    ])
                    .end();

                // 优化配置
                config.optimization
                    .runtimeChunk({
                        name: "runtime",
                    })
                    .splitChunks({
                        cacheGroups: {
                            vendors: {
                                name: "vendor-chunk",
                                test: /[\\/]node_modules[\\/](@vue|vue|vue-router|vuex|axios|qs|js-cookie|core-js|moment)[\\/]/,
                                priority: 20,
                                chunks: "initial",
                            },
                            antd: {
                                name: "antd",
                                test: /[\\/]node_modules[\\/](ant-design-vue|@ant-design)[\\/]/,
                                priority: 10,
                                chunks: "initial",
                            },
                        },
                    });

                // 支持 webpack bundle 分析
                config.when(process.env.npm_config_report, (config) => {
                    config.plugin("analyzer").use(BundleAnalyzerPlugin);
                });
            },
            (config) => {
                // 开发环境
            }
        );
    },
    css: {
        requireModuleExtension: true,
        loaderOptions: {
            less: {
                lessOptions: {
                    // 按需定制 antd 主题
                    modifyVars: theme,
                    javascriptEnabled: true,
                },
            },
        },
    },
};
