/**
 * @author: Tusi
 * @description: stylelint配置
 */
module.exports = {
    extends: ["stylelint-config-standard", "stylelint-prettier/recommended", "stylelint-config-recommended-vue", "stylelint-config-standard-scss"],
    plugins: ["stylelint-scss", "stylelint-prettier"],
    rules: {
        'prettier/prettier': true,
        "at-rule-no-unknown": null,
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
                ignorePseudoClasses: ["deep", "global"],
            },
        ],
        "keyframes-name-pattern": null,
        "selector-class-pattern": null,
        "property-no-unknown": null,
        "function-no-unknown": null,
        "no-invalid-double-slash-comments": null,
        // 允许--（BEM）的存在，而不是局限于-
        "scss/dollar-variable-pattern": "^_?[a-zA-Z0-9]+(?:-[a-z0-9]+)*(?:--[a-z0-9]+)?$",
        "scss/at-mixin-pattern": "^_?[a-zA-Z0-9]+(?:-[a-z0-9]+)*(?:--[a-z0-9]+)?$",
    },
    "overrides": [
        {
            "files": ["**/*.vue"],
            "customSyntax": "postcss-html"
        }
    ],
};
