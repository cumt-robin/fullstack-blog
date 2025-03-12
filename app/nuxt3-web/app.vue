<template>
    <NuxtLoadingIndicator />
    <a-config-provider
        :locale="zhCN"
        :theme="{
            token: {
                colorPrimary: '#008dff',
                colorLink: '#87b4e2',
            },
        }"
    >
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </a-config-provider>
</template>

<script lang="ts" setup>
import zhCN from "ant-design-vue/es/locale/zh_CN";
</script>

<style lang="less" scoped>
.hidden-x {
    overflow-x: hidden;
}

.is-admin {
    height: 100%;
}
</style>
