module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    extends: ["@fullstack-blog/eslint-config/base.js"],
    plugins: ["@typescript-eslint"],
    rules: {
        "no-debugger": "error",
        "no-case-declarations": "off",
        "import/order": "warn",
        "import/no-unresolved": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": [2, { ignoreRestArgs: true }],
    },
};
