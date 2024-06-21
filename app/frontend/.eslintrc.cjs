const path = require("path");

module.exports = {
    root: true,
    env: {
        node: true,
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        // for script
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2020,
    },
    extends: [
        "@fullstack-blog/eslint-config/base.js",
        "plugin:vue/vue3-strongly-recommended",
        "@vue/typescript/recommended",
        "@vue/prettier",
        "@vue/prettier/@typescript-eslint",
    ],
    settings: {
        // eslint-import-resolver-webpack
        "import/resolver": {
            webpack: {
                // 参考 https://cli.vuejs.org/zh/guide/webpack.html#%E4%BB%A5%E4%B8%80%E4%B8%AA%E6%96%87%E4%BB%B6%E7%9A%84%E6%96%B9%E5%BC%8F%E4%BD%BF%E7%94%A8%E8%A7%A3%E6%9E%90%E5%A5%BD%E7%9A%84%E9%85%8D%E7%BD%AE
                config: path.resolve(__dirname, "./node_modules/@vue/cli-service/webpack.config.js"),
            },
        },
    },
    rules: {
        "no-debugger": 2,
        "no-case-declarations": 0,
        "import/order": 1,
        "import/no-unresolved": 0,
        // https://eslint.vuejs.org/rules/
        "vue/require-default-prop": 0,
    },
    overrides: [
        {
            files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
            env: {
                jest: true,
            },
        },
        {
            files: ["*.ts", "*.tsx", "*.vue"],
            plugins: ["@typescript-eslint"],
            rules: {
                "@typescript-eslint/no-explicit-any": [2, { ignoreRestArgs: true }],
            },
        },
    ],
};
