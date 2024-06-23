module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ["@fullstack-blog/eslint-config/base.js"],
    rules: {
        "no-console": "off",
        "no-shadow": "off",
        "no-unused-vars": "off",
        "no-multi-str": "off",
    },
};
