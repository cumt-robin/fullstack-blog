import { createApp } from "vue";
import "./styles/index.scss";
import { createPinia } from "pinia";
import { initDayjs } from "@fullstack-blog/utils";
import { getOrCreateDeviceId, useAxios } from "@fullstack-blog/services";
import { message } from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import { sentryPlugin } from "./plugins/sentry";
import { eventBus } from "./utils/eventbus";
import { usePWA } from "./plugins/pwa";
import { unbindCurrentClientByDevice, usePushSubscription } from "./plugins/push";

initDayjs();
getOrCreateDeviceId();

let handlingSessionInvalid = false;

useAxios({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    onSessionInvalid: async () => {
        if (handlingSessionInvalid) {
            return;
        }
        handlingSessionInvalid = true;
        try {
            await unbindCurrentClientByDevice();
        } catch (error) {
            console.warn("Failed to unbind push subscription by device on session invalid:", error);
        } finally {
            eventBus.emit("sessionInvalid");
            router.push("/login");
            handlingSessionInvalid = false;
        }
    },
    onErrorMsg: (msg) => {
        message.error(msg);
    },
});

const pinia = createPinia();

const app = createApp(App);
app.use(sentryPlugin).use(pinia).use(router).mount("#app");

usePWA();
usePushSubscription().initPushSubscription();
