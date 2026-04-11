<script setup lang="ts">
import type { CommentUserInfo } from "@fullstack-blog/types";

const props = withDefaults(
    defineProps<{
        articleId?: number;
        topic?: string;
    }>(),
    {
        articleId: undefined,
        topic: "评论",
    },
);

const repositories = useRepositories();
const route = useRoute();
const { loadCommentUserInfo, saveCommentUserInfo } = useCommentIdentity();

const identityForm = reactive<CommentUserInfo>({
    nick_name: "",
    email: "",
    site_url: "",
});
const content = ref("");
const isSubmitting = ref(false);

if (import.meta.client) {
    const loaded = loadCommentUserInfo();
    if (loaded) {
        Object.assign(identityForm, loaded);
    }
}

const commentsKey = computed(() => `comments:${props.articleId ?? "messages"}`);
const { data, pending, refresh } = await useAsyncData(
    commentsKey,
    async () => {
        const response = await repositories.commentRepository.page({
            id: props.articleId,
            pageNo: 1,
            pageSize: 50,
        });
        return response.data;
    },
    { watch: [commentsKey] },
);

const submit = async () => {
    if (!identityForm.nick_name || !identityForm.email || !content.value.trim()) {
        return;
    }

    isSubmitting.value = true;
    try {
        saveCommentUserInfo(identityForm);
        await repositories.commentRepository.add({
            article_id: props.articleId,
            content: content.value.trim(),
            jump_url: import.meta.client ? window.location.href : route.fullPath,
            ...identityForm,
        });
        content.value = "";
        await refresh();
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <section class="panel comment-panel">
        <div class="comment-panel__header">
            <p class="eyebrow">{{ topic }}</p>
            <h3>{{ articleId ? "参与讨论" : "留下足迹" }}</h3>
        </div>

        <div class="comment-panel__form">
            <div class="comment-panel__grid">
                <input v-model="identityForm.nick_name" class="field" placeholder="昵称" />
                <input v-model="identityForm.email" class="field" placeholder="邮箱" />
                <input v-model="identityForm.site_url" class="field" placeholder="网站（可选）" />
            </div>
            <textarea v-model="content" class="textarea" :placeholder="`写下你的${topic}`" />
            <button class="button" :disabled="isSubmitting" @click="submit">{{ isSubmitting ? "提交中..." : `发布${topic}` }}</button>
        </div>

        <div v-if="pending" class="empty-state">加载中...</div>
        <ul v-else-if="data?.length" class="comment-list">
            <li v-for="comment in data" :key="comment.id">
                <article>
                    <header>
                        <strong>{{ comment.nick_name }}</strong>
                        <span class="muted">{{ comment.create_time }}</span>
                    </header>
                    <p>{{ comment.content }}</p>
                    <ul v-if="comment.replies?.length" class="reply-list">
                        <li v-for="reply in comment.replies" :key="reply.id">
                            <strong>{{ reply.nick_name }}</strong>
                            <span class="muted">{{ reply.create_time }}</span>
                            <p>{{ reply.content }}</p>
                        </li>
                    </ul>
                </article>
            </li>
        </ul>
        <div v-else class="empty-state">还没有{{ topic }}，欢迎成为第一个发言的人。</div>
    </section>
</template>

<style scoped>
.comment-panel {
    padding: 22px;
}

.comment-panel__header h3 {
    margin: 6px 0 0;
}

.comment-panel__form {
    display: grid;
    gap: 14px;
    margin: 18px 0 24px;
}

.comment-panel__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}

.comment-list,
.reply-list {
    display: grid;
    gap: 16px;
    list-style: none;
    padding: 0;
    margin: 0;
}

.comment-list article {
    padding-top: 16px;
    border-top: 1px solid var(--border);
}

.comment-list header,
.reply-list li {
    display: grid;
    gap: 4px;
}

.reply-list {
    margin-top: 12px;
    padding-left: 16px;
    border-left: 2px solid rgba(14, 116, 144, 0.18);
}

@media (width <= 720px) {
    .comment-panel__grid {
        grid-template-columns: 1fr;
    }
}
</style>
