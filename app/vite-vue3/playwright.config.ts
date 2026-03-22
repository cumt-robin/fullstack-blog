/* eslint-disable no-underscore-dangle */
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 获取 __dirname（ES 模块中不可用，需要转换）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load environment variables from .env files following Vite's convention:
 * 1. .env - loaded in all cases
 * 2. .env.local - loaded in all cases, ignored by git
 * 3. .env.[mode] - loaded in specific mode (development/production)
 * 4. .env.[mode].local - loaded in specific mode, ignored by git
 */
const mode = process.env.CI ? "preview" : process.env.NODE_ENV || "development";
const envFiles = [".env", ".env.local", `.env.${mode}`, `.env.${mode}.local`].filter((file) =>
    fs.existsSync(path.resolve(__dirname, file)),
);

envFiles.forEach((file) => {
    dotenv.config({
        path: path.resolve(__dirname, file),
        override: true,
    });
});

// 输出 baseURL
const port = process.env.CI ? 4173 : 3000;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./tests",
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "html",
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class/testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('')`. */
        baseURL: `http://localhost:${port}`,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
        serviceWorkers: "block",
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: process.env.CI ? "pnpm preview" : "pnpm dev",
        port,
        reuseExistingServer: true,
    },
});
