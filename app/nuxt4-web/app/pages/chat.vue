<script setup lang="ts">
definePageMeta({
    layout: "default",
});
</script>

<template>
    <section class="panel client-feature-page">
        <p class="eyebrow">Chat</p>
        <h2>在线聊天室</h2>
        <p class="muted">实时聊天依赖浏览器 WebSocket，仅在客户端可用。完整 UI 与 socket 逻辑可在后续接入现有聊天模块。</p>
        <p class="muted">此页面为占位路由，对应 vite-vue3 <code>/chat</code>。</p>
    </section>
</template>

<style scoped>
.client-feature-page {
    padding: 24px;
}
</style>
