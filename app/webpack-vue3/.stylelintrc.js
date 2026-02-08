/**
 * @author: Tusi
 * @description: stylelint配置
 */
module.exports = {
    extends: ["stylelint-config-standard", "stylelint-prettier/recommended", "stylelint-config-recommended-vue"],
    plugins: ["stylelint-scss", "stylelint-less", "stylelint-prettier"],
    rules: {
        'prettier/prettier': true,
        "at-rule-no-unknown": null,
        "color-no-invalid-hex": true,
        "less/color-no-invalid-hex": true,
        "no-descending-specificity": null,
        "selector-pseudo-element-no-unknown": [
            true,
            {
                ignorePseudoElements: ["deep"],
            },
        ],
        "selector-pseudo-class-no-unknown": [
            true,
            {
                "ignorePseudoClasses": ["deep", "global"],
            },
        ],
        "selector-class-pattern": null,
        "keyframes-name-pattern": null,
        "import-notation": null,
    },
    overrides: [
        {
            files: ["**/*.vue"],
            customSyntax: "postcss-html"
        }
    ]
};
