<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const pageNo = computed(() => Math.max(1, Number(route.query.pageNo || 1)));
const pageSize = 6;
const tagName = computed(() => decodeURIComponent(String(route.params.name || "")));

const { data, pending } = await useTagArticles(tagName, pageSize);

const updatePage = (page: number) => router.push({ query: { pageNo: String(page) } });
</script>

<template>
    <section class="stack">
        <div class="breadcrumbs">
            <span><NuxtLink to="/">首页</NuxtLink></span>
            <span><NuxtLink to="/tags">标签</NuxtLink></span>
            <span>{{ tagName }}</span>
        </div>

        <div v-if="pending" class="empty-state panel">加载文章中...</div>
        <template v-else-if="data?.data?.length">
            <div class="article-grid">
                <ArticleCard v-for="article in data.data" :key="article.id" :article="article" />
            </div>
            <PaginationNav :page-no="pageNo" :page-size="pageSize" :total="data.total" @update="updatePage" />
        </template>
        <div v-else class="empty-state panel">该标签下还没有文章。</div>
    </section>
</template>
