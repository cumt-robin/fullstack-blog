/**
 * @author: Tusi
 * @description: stylelint配置
 */
module.exports = {
    extends: ["stylelint-config-standard", "stylelint-prettier/recommended", "stylelint-config-prettier"],
    plugins: ["stylelint-less", "stylelint-prettier"],
    rules: {
        'prettier/prettier': true,
        "max-empty-lines": 1,
        "selector-max-empty-lines": 0,
        "function-max-empty-lines": 0,
        "value-list-max-empty-lines": 0,
        "no-descending-specificity": null,
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: ["mixin", "include", "extend", "at-root"]
            }
        ]
    },
};
