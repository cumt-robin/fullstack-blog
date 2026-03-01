import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver, ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const { VITE_APP_BASE_API, VITE_APP_BACKEND_SERVER, VITE_APP_SENTRY_ORG, VITE_APP_SENTRY_PROJECT, VITE_APP_SENTRY_TOKEN } = loadEnv(
        mode,
        process.cwd(),
    );
    return defineConfig({
        server: {
            host: "0.0.0.0",
            port: 3000,
            proxy: {
                [VITE_APP_BASE_API]: {
                    target: VITE_APP_BACKEND_SERVER,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_BASE_API}/`), "/"),
                },
            },
        },
        plugins: [
            vue(),
            vueJsx(),
            Components({
                resolvers: [AntDesignVueResolver({ importStyle: false, resolveIcons: true }), ElementPlusResolver({ importStyle: true })],
            }),
            sentryVitePlugin({
                org: VITE_APP_SENTRY_ORG,
                project: VITE_APP_SENTRY_PROJECT,
                authToken: VITE_APP_SENTRY_TOKEN,
            }),
            VitePWA({
                registerType: "autoUpdate",
                includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
                manifest: {
                    name: "Tusi博客",
                    short_name: "Tusi博客",
                    description: "A fullstack blog built with Vue 3 and Vite",
                    theme_color: "#ffffff",
                    background_color: "#ffffff",
                    display: "standalone",
                    scope: "/",
                    start_url: "/",
                    icons: [
                        {
                            src: "/pwa-192x192.png",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "/pwa-512x512.png",
                            sizes: "512x512",
                            type: "image/png",
                        },
                        {
                            src: "/pwa-512x512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "any maskable",
                        },
                    ],
                },
                workbox: {
                    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
                },
                devOptions: {
                    enabled: true,
                },
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                    // additionalData: '@import "@/styles/preload.less";',
                },
                scss: {
                    additionalData: '@import "@/styles/preload.scss";',
                },
            },
        },
        build: {
            sourcemap: "hidden",
        },
    });
});
