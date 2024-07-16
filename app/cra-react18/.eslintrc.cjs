module.exports = {
    root: true,
    env: {
        node: true,
    },
    parser: "@typescript-eslint/parser",
    extends: ["eslint:recommended", "react-app", "react-app/jest", "prettier"],
    plugins: ["prettier"],
    settings: {
        // eslint-import-resolver-webpack
        "import/resolver": {
            webpack: {
                config: "config/webpack.config.js",
            },
        },
    },
    rules: {
        "prettier/prettier": "error",
        "no-case-declarations": "off",
        "import/order": "warn",
        "import/no-unresolved": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "react-hooks/exhaustive-deps": "error",
        "react-hooks/rules-of-hooks": "error",
    },
};
