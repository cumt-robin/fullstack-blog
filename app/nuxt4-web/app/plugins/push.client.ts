/**
 * Push / Service Worker 注册逻辑应集中在此 client 插件。
 * 完整订阅流程可参考 vite-vue3 `plugins/push`；此处仅占位，避免在 SSR 中访问 Notification 等 API。
 */
export default defineNuxtPlugin(() => {
    return {
        provide: {
            pushReady: true,
        },
    };
});
