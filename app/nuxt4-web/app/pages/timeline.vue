<script setup lang="ts">
import { format } from "@fullstack-blog/utils";
import type { ArticleDTO } from "@fullstack-blog/types";

const pageSize = 6;
const repositories = useRepositories();

const { data: firstPage, pending } = await useTimelineFirstPage(pageSize);

const articleList = ref<(ArticleDTO & { formattedCreateTime?: string })[]>([]);
const total = ref(0);
const pageNo = ref(1);
const loadingMore = ref(false);

watch(
    () => firstPage.value,
    (val) => {
        if (!val?.data) {
            return;
        }
        articleList.value = val.data.map((item) => ({
            ...item,
            formattedCreateTime: format(item.create_time),
        }));
        total.value = val.total;
        pageNo.value = 1;
    },
    { immediate: true },
);

const loadMore = async () => {
    if (articleList.value.length >= total.value || loadingMore.value) {
        return;
    }
    loadingMore.value = true;
    try {
        pageNo.value += 1;
        const res = await repositories.articleRepository.page({ pageNo: pageNo.value, pageSize });
        const mapped = res.data.map((item) => ({
            ...item,
            formattedCreateTime: format(item.create_time),
        }));
        articleList.value = [...articleList.value, ...mapped];
        total.value = res.total;
    } finally {
        loadingMore.value = false;
    }
};
</script>

<template>
    <section class="stack timeline-stack">
        <p class="eyebrow">Timeline</p>
        <h2 class="panel timeline-title">时间轴</h2>

        <div v-if="pending" class="empty-state panel">加载中...</div>
        <ul v-else-if="articleList.length" class="timeline-list panel">
            <li v-for="article in articleList" :key="article.id" class="timeline-item">
                <NuxtLink :to="`/article/${article.id}`" class="timeline-card">
                    <img v-if="article.poster" :src="article.poster" :alt="article.article_name" class="timeline-poster" />
                    <div class="timeline-body">
                        <time class="muted">{{ article.formattedCreateTime }}</time>
                        <h3>{{ article.article_name }}</h3>
                        <div class="timeline-cats">
                            <NuxtLink
                                v-for="category in article.categories"
                                :key="category.id"
                                :to="`/category/${encodeURIComponent(category.categoryName)}`"
                                class="mini-chip"
                                @click.stop
                            >
                                {{ category.categoryName }}
                            </NuxtLink>
                        </div>
                    </div>
                </NuxtLink>
            </li>
        </ul>
        <div v-else class="empty-state panel">暂无文章。</div>

        <div class="timeline-actions">
            <button v-if="articleList.length < total" class="button" type="button" :disabled="loadingMore" @click="loadMore">
                {{ loadingMore ? "加载中..." : "加载更多" }}
            </button>
            <span v-else class="muted">没有更多了</span>
        </div>
    </section>
</template>

<style scoped>
.timeline-title {
    padding: 20px 24px;
    margin: 0 0 16px;
}

.timeline-list {
    list-style: none;
    margin: 0;
    padding: 12px 0;
}

.timeline-item {
    border-bottom: 1px solid var(--border);
}

.timeline-item:last-child {
    border-bottom: none;
}

.timeline-card {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr);
    gap: 16px;
    padding: 16px 24px;
    align-items: center;
}

.timeline-poster {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
}

.timeline-body h3 {
    margin: 6px 0 8px;
    font-size: 1.1rem;
}

.timeline-cats {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.mini-chip {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(14, 116, 144, 0.1);
    color: var(--primary-strong);
}

.timeline-actions {
    margin-top: 20px;
    text-align: center;
}
</style>
