import { createApp } from "vue";
import "./styles/index.scss";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { init } from "./utils/date-utils";
import { sentryPlugin } from "./plugins/sentry";

init();

const pinia = createPinia();

const app = createApp(App);
app.use(sentryPlugin).use(pinia).use(router).mount("#app");
