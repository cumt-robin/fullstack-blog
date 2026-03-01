module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    rootDir: "./src",
    testMatch: ["**/*.dom.test.ts"],
    collectCoverageFrom: ["**/*.ts", "!**/index.ts", "!**/*.test.ts", "!**/*.spec.ts"],
    coverageDirectory: "../coverage",
    moduleFileExtensions: ["ts", "js", "json"],
    moduleNameMapper: {
        "^@fullstack-blog/(.*)$": "<rootDir>/../$1/src",
        "^lodash-es$": "lodash",
    },
    transformIgnorePatterns: ["node_modules/(?!(lodash-es|dayjs|bezier-easing)/)"],
    setupFilesAfterEnv: ["<rootDir>/../jest.setup.js"],
    testEnvironmentOptions: {
        url: "http://localhost/",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: {
                    jsx: "react",
                    esModuleInterop: true,
                    allowSyntheticDefaultImports: true,
                },
            },
        ],
    },
};
