<script setup lang="ts">
import type { ArticleDTO } from "@fullstack-blog/types";
import { format } from "@fullstack-blog/utils";

const props = defineProps<{
    article: ArticleDTO;
}>();

const createTime = computed(() => format(props.article.create_time, "YYYY年MM月DD日"));
</script>

<template>
    <article class="panel article-card">
        <NuxtLink :to="`/article/${article.id}`" class="article-card__poster-wrap">
            <img v-if="article.poster" :src="article.poster" :alt="article.article_name" class="article-card__poster" />
        </NuxtLink>

        <div class="article-card__body">
            <p class="article-card__meta">
                <span>{{ createTime }}</span>
                <span>阅读 {{ article.read_num }}</span>
            </p>

            <NuxtLink :to="`/article/${article.id}`">
                <h2>{{ article.article_name }}</h2>
            </NuxtLink>

            <p class="article-card__summary">{{ article.summary }}</p>

            <div class="article-card__tags">
                <NuxtLink
                    v-for="category in article.categories"
                    :key="category.id"
                    class="chip"
                    :to="`/category/${encodeURIComponent(category.categoryName)}`"
                >
                    {{ category.categoryName }}
                </NuxtLink>
            </div>
        </div>
    </article>
</template>

<style scoped>
.article-card {
    overflow: hidden;
}

.article-card__poster-wrap {
    display: block;
    background: linear-gradient(180deg, rgba(14, 116, 144, 0.14), transparent);
}

.article-card__poster {
    width: 100%;
    height: 240px;
    object-fit: cover;
}

.article-card__body {
    padding: 20px;
}

.article-card__meta {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    font-size: 13px;
    color: var(--muted);
}

.article-card h2 {
    margin: 10px 0 12px;
    font-size: clamp(22px, 3vw, 30px);
}

.article-card__summary {
    margin: 0;
    color: var(--muted);
    line-height: 1.7;
}

.article-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
}

.chip {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(14, 116, 144, 0.1);
    color: var(--primary-strong);
    font-size: 13px;
}
</style>
