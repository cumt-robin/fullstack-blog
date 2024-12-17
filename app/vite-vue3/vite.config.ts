import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver, ElementPlusResolver } from "unplugin-vue-components/resolvers";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 3000,
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8002",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    plugins: [
        vue(),
        vueJsx(),
        Components({
            resolvers: [AntDesignVueResolver({ importStyle: false, resolveIcons: true }), ElementPlusResolver({ importStyle: true })],
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
                javascriptEnabled: true,
                additionalData: '@import "@/styles/preload.scss";',
            },
        },
    },
});
