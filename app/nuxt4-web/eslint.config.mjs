import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tsEslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default tsEslint.config(
    { ignores: ["node_modules", ".nuxt", ".output", "*.d.ts"] },
    {
        extends: [pluginJs.configs.recommended, ...tsEslint.configs.recommended, ...eslintPluginVue.configs["flat/recommended"]],
        files: ["**/*.{js,ts,tsx,vue}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.browser,
            parser: vueParser,
            parserOptions: {
                parser: tsEslint.parser,
            },
        },
        rules: {
            "prettier/prettier": "error",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "vue/multi-word-component-names": "off",
            "vue/no-v-html": "warn",
        },
    },
    eslintPluginPrettierRecommended,
    eslintConfigPrettier,
    {
        files: ["**/types/blog.ts"],
        rules: {
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
);
