<script setup lang="ts">
const { data, pending } = await useHotArticles(6);
</script>

<template>
    <section class="panel hot-panel">
        <div class="hot-panel__header">
            <p class="eyebrow">Popular</p>
            <h3>热门推荐</h3>
        </div>

        <div v-if="pending" class="empty-state">加载热门文章中...</div>
        <ul v-else-if="data?.length" class="hot-list">
            <li v-for="article in data" :key="article.id">
                <NuxtLink :to="`/article/${article.id}`">
                    <img v-if="article.poster" :src="article.poster" :alt="article.article_name" />
                    <div>
                        <strong>{{ article.article_name }}</strong>
                        <span class="muted">阅读 {{ article.read_num }}</span>
                    </div>
                </NuxtLink>
            </li>
        </ul>
        <div v-else class="empty-state">暂无热门文章。</div>
    </section>
</template>

<style scoped>
.hot-panel {
    padding: 20px;
}

.hot-panel__header h3 {
    margin: 6px 0 0;
}

.hot-list {
    display: grid;
    gap: 14px;
    margin: 18px 0 0;
    padding: 0;
    list-style: none;
}

.hot-list a {
    display: grid;
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 12px;
    align-items: center;
}

.hot-list img {
    width: 76px;
    height: 58px;
    object-fit: cover;
    border-radius: 14px;
}

.hot-list strong,
.hot-list span {
    display: block;
}

.hot-list strong {
    margin-bottom: 6px;
}
</style>
