// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: ["@ant-design-vue/nuxt", "@pinia/nuxt"],
    vite: {
        server: {
            // 此处只代理客户端请求
            proxy: {
                "/gateway": {
                    target: "http://127.0.0.1:8012",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/gateway/, ""),
                },
            },
        },
    },
    hooks: {
        "pages:extend": (pages) => {
            pages.push({
                path: "/",
                redirect: "/article/page/1",
            });
        },
    },
});
