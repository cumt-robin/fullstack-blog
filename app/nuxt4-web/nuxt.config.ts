export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devServer: {
        port: 3003,
    },
    devtools: { enabled: true },
    css: ["~/assets/styles/main.css"],
    runtimeConfig: {
        apiTarget: process.env.NUXT_API_TARGET || "http://localhost:8012",
        public: {
            apiBase: "/api",
            siteTitle: process.env.NUXT_PUBLIC_SITE_TITLE || "Tusi 博客",
        },
    },
    future: {
        compatibilityVersion: 4,
    },
    imports: {
        dirs: ["~/composables/**"],
    },
});
