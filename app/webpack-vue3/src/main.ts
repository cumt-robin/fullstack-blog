/**
 * @author: Tusi
 * @description: 入口文件
 */

import "ant-design-vue/es/message/style";
import "./styles/index.scss";
import { createApp } from "vue";
import { initDayjs } from "@fullstack-blog/utils";
import { useAxios } from "@fullstack-blog/services";
import { message } from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import { eventBus } from "./utils/eventbus";

initDayjs();
useAxios({
    baseURL: process.env.VUE_APP_BASE_API,
    onSessionInvalid: () => {
        eventBus.emit("sessionInvalid");
        router.push("/login");
    },
    onErrorMsg: (msg) => {
        message.error(msg);
    },
});

export const app = createApp(App);

app.use(store, key);
app.use(router);
app.mount("#app");
