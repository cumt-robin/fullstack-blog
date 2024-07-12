<!--
 * @author: Tusi
 * @description: App
-->
<template>
    <a-config-provider :locale="zhCN">
        <section :class="{ 'hidden-x': isMenuVisible, 'is-admin': isAdmin }">
            <router-view :key="$route.path" />
        </section>
    </a-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { useRoute } from "vue-router";
import { ConfigProvider } from "ant-design-vue";
import { useBaseStore } from "@/store";
import { CLEAR_USER_SESSION } from "@/store/constants";
import { eventBus } from "./utils/eventbus";

export default defineComponent({
    components: {
        [ConfigProvider.name as string]: ConfigProvider,
    },
    setup() {
        // vuex
        const store = useBaseStore();
        // route
        const route = useRoute();

        const handleEvents = () => {
            eventBus.on("sessionInvalid", () => {
                store.dispatch(CLEAR_USER_SESSION);
            });
        };

        handleEvents();

        const isAdmin = computed(() => route.meta.isAdmin as boolean);

        const isMenuVisible = computed(() => store.state.isMenuVisible);

        return {
            isMenuVisible,
            zhCN,
            isAdmin,
        };
    },
});
</script>

<style lang="scss" scoped>
.hidden-x {
    overflow-x: hidden;
}
.is-admin {
    height: 100%;
}
</style>
