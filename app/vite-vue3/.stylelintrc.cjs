/**
 * @author: Tusi
 * @description: stylelint配置
 */
module.exports = {
    extends: ["stylelint-config-standard", "stylelint-prettier/recommended", "stylelint-config-recommended-vue"],
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
    },
};
