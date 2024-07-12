/**
 * @author: Tusi
 * @description: 入口文件
 */

import "ant-design-vue/es/message/style";
import "./styles/index.scss";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import { init } from "./utils/date-utils";

init();

export const app = createApp(App);

app.use(store, key);
app.use(router);
app.mount("#app");
