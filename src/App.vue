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
import { useStore } from "vuex";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { useRoute } from "vue-router";
import { ConfigProvider } from "ant-design-vue";
import { key } from "@/store";

export default defineComponent({
    components: {
        [ConfigProvider.name]: ConfigProvider,
    },
    setup() {
        // vuex
        const store = useStore(key);
        // route
        const route = useRoute();

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
