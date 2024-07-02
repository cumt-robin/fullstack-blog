/**
 * @author: Tusi
 * @description: babel配置
 */
module.exports = {
    presets: ["@vue/cli-plugin-babel/preset"],
    plugins: [
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-nullish-coalescing-operator",
        [
            "import",
            {
                libraryName: "ant-design-vue",
                libraryDirectory: "es",
                // 配合按需加载以及主题定制
                style: true,
            },
        ],
        [
            "import",
            {
                libraryName: "element-plus",
                customStyleName: (name) => {
                    name = name.slice(3);
                    return `element-plus/packages/theme-chalk/src/${name}.scss`;
                },
            },
            "element",
        ],
    ],
};
