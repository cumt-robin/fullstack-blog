module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        browser: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    extends: ["@fullstack-blog/eslint-config/base.js", "plugin:@typescript-eslint/recommended"],
    plugins: ["@typescript-eslint"],
    rules: {
        "no-debugger": "error",
        "no-case-declarations": "off",
        "import/order": "warn",
        "import/no-unresolved": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
        "valid-typeof": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": [2, { ignoreRestArgs: true }],
    },
};
