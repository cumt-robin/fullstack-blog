export default {
    extends: ["@commitlint/config-conventional"],
    /*
     * Any rules defined here will override rules from @commitlint/config-conventional
     */
    rules: {
        "type-enum": [2, "always", ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]],
    },
};
