/**
 * 全局按需引入 element-plus 组件
 */

import { App } from "vue";

import { ElImage } from "element-plus";

import "element-plus/packages/theme-chalk/src/base.scss";

const components = [ElImage];

export default {
    install(app: App): App {
        components.forEach((comp) => {
            app.component(comp.name as string, comp);
        });
        return app;
    },
};
