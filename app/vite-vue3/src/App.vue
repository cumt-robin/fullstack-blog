<!--
 * @author: Tusi
 * @description: App
-->
<template>
    <a-config-provider
        :locale="zhCN"
        :theme="{
            token: {
                colorPrimary: '#008dff',
                colorLink: '#87b4e2',
            },
        }"
    >
        <section :class="{ 'hidden-x': isMenuVisible, 'is-admin': isAdmin }">
            <router-view :key="$route.path" />
        </section>
    </a-config-provider>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { useRoute } from "vue-router";
import { eventBus } from "./utils/eventbus";
import { useAuthStore } from "./stores/auth";
import { useGlobalUIState } from "./stores/global-ui-state";

const route = useRoute();

const { clearUserSession } = useAuthStore();

const { isMenuVisible } = useGlobalUIState();

const handleEvents = () => {
    eventBus.on("sessionInvalid", () => {
        clearUserSession();
    });
};

handleEvents();

const isAdmin = computed(() => route.meta.isAdmin as boolean);
</script>

<style lang="scss" scoped>
.hidden-x {
    overflow-x: hidden;
}
.is-admin {
    height: 100%;
}
</style>
