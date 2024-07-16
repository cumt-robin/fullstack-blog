/**
 * @author: Tusi
 * @description: stylelint配置
 */
module.exports = {
    extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
    plugins: ["stylelint-less", "stylelint-prettier"],
    rules: {
        "no-descending-specificity": null,
        "at-rule-no-unknown": null,
        "color-no-invalid-hex": true,
        "less/color-no-invalid-hex": true,
        "keyframes-name-pattern": null,
        "selector-class-pattern": null,
        "import-notation": null,
        "no-invalid-position-at-import-rule": null
    },
    customSyntax: "postcss-styled-syntax",
    overrides: [
        {
            files: ["**/*.less"],
            customSyntax: "postcss-less",
        },
    ],
};
