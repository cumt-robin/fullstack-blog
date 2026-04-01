import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver, ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
    const { VITE_APP_BASE_API, VITE_APP_BACKEND_SERVER, VITE_APP_SENTRY_ORG, VITE_APP_SENTRY_PROJECT, VITE_APP_SENTRY_TOKEN } = loadEnv(
        mode,
        process.cwd(),
    );
    return defineConfig({
        preview: {
            proxy: {
                [VITE_APP_BASE_API]: {
                    target: VITE_APP_BACKEND_SERVER,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_BASE_API}/`), "/"),
                },
            },
        },
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
                    importScripts: ["/sw-push.js"],
                    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
                    runtimeCaching: [
                        {
                            urlPattern: /\.(?:js|css|html)$/,
                            handler: "NetworkFirst",
                            options: {
                                cacheName: "static-resources",
                                networkTimeoutSeconds: 3,
                                expiration: {
                                    maxEntries: 100,
                                    maxAgeSeconds: 60 * 60,
                                },
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                        {
                            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
                            handler: "StaleWhileRevalidate",
                            options: {
                                cacheName: "images-cache",
                                expiration: {
                                    maxEntries: 200,
                                    maxAgeSeconds: 60 * 60 * 24 * 7,
                                },
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                        {
                            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
                            handler: "CacheFirst",
                            options: {
                                cacheName: "fonts-cache",
                                expiration: {
                                    maxEntries: 50,
                                    maxAgeSeconds: 60 * 60 * 24 * 30,
                                },
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                    ],
                    clientsClaim: true,
                    skipWaiting: true,
                },
                devOptions: {
                    enabled: true,
                },
            }),
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/styles/preload.scss";',
                },
            },
        },
        build: {
            sourcemap: "hidden",
        },
    });
};
