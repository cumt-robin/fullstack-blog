<script setup lang="ts">
const route = useRoute();
const targetUrl = computed(() => {
    const raw = route.params.target;
    const encoded = Array.isArray(raw) ? raw[0] : raw;
    return encoded ? decodeURIComponent(encoded) : "";
});
</script>

<template>
    <section class="panel jumpout-page">
        <h2>即将离开本站</h2>
        <p class="muted">目标地址：</p>
        <p class="target-url">{{ targetUrl }}</p>
        <div class="actions">
            <a class="button" :href="targetUrl" rel="nofollow noopener noreferrer">继续访问</a>
            <NuxtLink class="button" to="/">返回首页</NuxtLink>
        </div>
    </section>
</template>

<style scoped>
.jumpout-page {
    padding: 28px;
    max-width: 560px;
    margin: 0 auto;
}

.target-url {
    word-break: break-all;
    font-size: 14px;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
}
</style>
