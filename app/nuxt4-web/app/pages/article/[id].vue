<script setup lang="ts">
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { format } from "@fullstack-blog/utils";

const route = useRoute();
const articleId = computed(() => Number(route.params.id));

const { data: detailRes, pending } = await useArticleDetail(articleId);
const { data: neighborsRes } = await useArticleNeighbors(articleId);

const article = computed(() => detailRes.value?.data);

const formattedTime = computed(() => (article.value ? format(article.value.create_time, "YYYY年M月D日") : ""));

const purifiedContent = computed(() => {
    const raw = article.value?.article_text;
    if (!raw) {
        return "";
    }
    const html = marked.parse(raw) as string;
    return DOMPurify.sanitize(html);
});

const postLink = computed(() => (import.meta.client ? window.location.href : ""));

const prevNext = computed(() => {
    const id = articleId.value;
    const list = neighborsRes.value?.data ?? [];
    if (list.length === 0) {
        return { prev: null as null | { id: number; article_name: string }, next: null as null | { id: number; article_name: string } };
    }
    if (list.length === 1) {
        const single = list[0];
        return single.id < id ? { prev: single, next: null } : { prev: null, next: single };
    }
    const sorted = [...list].sort((a, b) => a.id - b.id);
    return { prev: sorted[0], next: sorted[1] };
});

let readTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
    readTimer = setTimeout(async () => {
        if (!article.value?.id) {
            return;
        }
        try {
            await useRepositories().articleRepository.updateReadNum(article.value.id);
        } catch {
            /* ignore */
        }
    }, 5000);
});

onBeforeUnmount(() => {
    if (readTimer) {
        clearTimeout(readTimer);
    }
});

const onClickRichContent = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A") {
        e.preventDefault();
        const href = (target as HTMLAnchorElement).href;
        navigateTo(`/jumpout/${encodeURIComponent(href)}`);
    }
};

watch(
    () => article.value?.article_name,
    (title) => {
        if (title) {
            useSeoMeta({ title: `${title} · 文章` });
        }
    },
    { immediate: true },
);
</script>

<template>
    <section class="stack article-page">
        <div v-if="pending" class="empty-state panel">加载文章中...</div>
        <article v-else-if="article" class="panel article-detail">
            <header class="article-header">
                <div class="article-infos">
                    <span class="author">Tusi</span>
                    <span class="role-tag">博主</span>
                    <div class="article-meta-line">
                        <time>发布于{{ formattedTime }}</time>
                        <span>阅读 {{ article.read_num }}</span>
                    </div>
                </div>
            </header>

            <img v-if="article.poster" :src="article.poster" :alt="article.article_name" class="article-poster" />

            <h1 class="article-title">{{ article.article_name }}</h1>

            <section class="md-preview" @click="onClickRichContent" v-html="purifiedContent" />

            <div class="copyright muted">
                <p>
                    本文链接：<a v-if="postLink" :href="postLink">{{ postLink }}</a>
                </p>
            </div>

            <div class="relation-info">
                <div v-if="article.categories?.length">
                    分类：
                    <NuxtLink
                        v-for="item in article.categories"
                        :key="item.id"
                        :to="`/category/${encodeURIComponent(item.categoryName)}`"
                        class="chip"
                    >
                        {{ item.categoryName }}
                    </NuxtLink>
                </div>
                <div v-if="article.tags?.length" class="tags-row">
                    标签：
                    <NuxtLink v-for="item in article.tags" :key="item.id" :to="`/tag/${encodeURIComponent(item.tagName)}`" class="chip">
                        {{ item.tagName }}
                    </NuxtLink>
                </div>
            </div>
        </article>
        <div v-else class="empty-state panel">文章不存在或已删除。</div>

        <div v-if="article" class="pre-next panel">
            <div v-if="prevNext.prev" class="pre-next-row">
                <span>上一篇：</span>
                <NuxtLink :to="`/article/${prevNext.prev.id}`">{{ prevNext.prev.article_name }}</NuxtLink>
            </div>
            <div v-if="prevNext.next" class="pre-next-row">
                <span>下一篇：</span>
                <NuxtLink :to="`/article/${prevNext.next.id}`">{{ prevNext.next.article_name }}</NuxtLink>
            </div>
        </div>

        <CommentSection v-if="article" :article-id="article.id" />
    </section>
</template>

<style scoped>
.article-detail {
    padding: 24px;
}

.article-header {
    margin-bottom: 16px;
}

.article-infos {
    display: grid;
    gap: 8px;
}

.role-tag {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 6px;
    background: rgba(14, 116, 144, 0.15);
    width: fit-content;
}

.article-meta-line {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: var(--muted);
}

.article-poster {
    width: 100%;
    max-height: 420px;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 20px;
}

.article-title {
    font-size: clamp(24px, 4vw, 34px);
    margin: 0 0 20px;
}

.md-preview {
    line-height: 1.75;
    font-size: 16px;
}

.md-preview :deep(pre) {
    overflow: auto;
    padding: 12px;
    border-radius: 12px;
    background: #1e293b;
    color: #e2e8f0;
}

.md-preview :deep(img) {
    max-width: 100%;
    border-radius: 12px;
}

.relation-info {
    margin-top: 24px;
    display: grid;
    gap: 12px;
}

.tags-row {
    margin-top: 8px;
}

.chip {
    display: inline-flex;
    margin: 4px 8px 4px 0;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(14, 116, 144, 0.1);
    color: var(--primary-strong);
    font-size: 13px;
}

.pre-next {
    padding: 16px 20px;
    margin-top: 16px;
    display: grid;
    gap: 10px;
}

.pre-next-row {
    font-size: 14px;
}
</style>
