import { test, expect } from "@playwright/test";

test("首页加载正常", async ({ page }) => {
    // 访问首页
    await page.goto("/", {
        timeout: 15000,
        waitUntil: "domcontentloaded",
    });

    // 等待 .article-list 渲染出来
    await expect(page.locator(".article-list")).toBeVisible();
});

test("详情加载正常", async ({ page }) => {
    // 访问首页
    await page.goto("/", {
        timeout: 15000,
        waitUntil: "domcontentloaded",
    });

    // 等待 .article-list 渲染出来
    await expect(page.locator(".article-list")).toBeVisible();

    // 点击第一个文章标题，并等待跳转
    const firstArticle = page.locator(".article__wrapper .article-title").first();
    await firstArticle.waitFor({ state: "visible" });

    // 使用 Promise.all 确保点击和跳转等待同时进行
    await Promise.all([
        page.waitForURL(/\/article\//, {
            timeout: 15000,
            waitUntil: "domcontentloaded",
        }),
        firstArticle.click(),
    ]);

    // 等待文章详情页渲染出来
    await expect(page.locator(".md-preview")).toBeVisible();
});

test("留言板加载正常", async ({ page }) => {
    // 访问留言板
    await page.goto("/messages", {
        timeout: 15000,
        waitUntil: "domcontentloaded",
    });

    // 等待留言板加载完成
    await expect(page.locator(".comments__list")).toBeVisible();
});
