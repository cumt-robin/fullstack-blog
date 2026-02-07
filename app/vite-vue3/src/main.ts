import { createApp } from "vue";
import "./styles/index.scss";
import { createPinia } from "pinia";
import { initDayjs } from "@fullstack-blog/utils";
import { useAxios } from "@fullstack-blog/services";
import { message } from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import { sentryPlugin } from "./plugins/sentry";
import { eventBus } from "./utils/eventbus";

initDayjs();
useAxios({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    onSessionInvalid: () => {
        eventBus.emit("sessionInvalid");
        router.push("/login");
    },
    onErrorMsg: (msg) => {
        message.error(msg);
    },
});

const pinia = createPinia();

const app = createApp(App);
app.use(sentryPlugin).use(pinia).use(router).mount("#app");
