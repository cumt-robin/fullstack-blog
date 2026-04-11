<script setup lang="ts">
const { data, pending } = await useCategoriesPage();
</script>

<template>
    <section class="panel category-panel">
        <p class="eyebrow">Categories</p>
        <h2>文章分类</h2>
        <div v-if="pending" class="empty-state">加载分类中...</div>
        <div v-else-if="data?.length" class="category-grid">
            <NuxtLink
                v-for="category in data"
                :key="category.id"
                class="category-card"
                :to="`/category/${encodeURIComponent(category.category_name)}`"
            >
                <img v-if="category.poster" :src="category.poster" :alt="category.category_name" />
                <strong>{{ category.category_name }}</strong>
                <span class="muted">{{ category.category_count || 0 }} 篇</span>
            </NuxtLink>
        </div>
        <div v-else class="empty-state">暂无分类。</div>
    </section>
</template>

<style scoped>
.category-panel {
    padding: 24px;
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-top: 18px;
}

.category-card {
    display: grid;
    gap: 10px;
    padding: 14px;
    border-radius: 20px;
    background: color-mix(in srgb, var(--surface-alt) 72%, white);
}

.category-card img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 16px;
}
</style>
