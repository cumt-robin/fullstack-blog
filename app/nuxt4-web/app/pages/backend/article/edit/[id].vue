<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const repositories = useRepositories();
const id = computed(() => Number(route.params.id));

const { data: detailRes, pending } = await useArticleDetail(id);

const form = reactive({
    articleTitle: "",
    articleText: "",
    summary: "",
    poster: "",
    private: 0 as 0 | 1,
});

watch(
    () => detailRes.value?.data,
    (article) => {
        if (!article) {
            return;
        }
        form.articleTitle = article.article_name;
        form.articleText = article.article_text;
        form.summary = article.summary;
        form.poster = article.poster || "";
        form.private = article.private === 1 ? 1 : 0;
    },
    { immediate: true },
);

const saving = ref(false);

const onSubmit = async () => {
    saving.value = true;
    try {
        await repositories.articleRepository.update({
            id: id.value,
            articleTitle: form.articleTitle,
            articleText: form.articleText,
            summary: form.summary,
            poster: form.poster,
            private: form.private,
        });
        await refreshNuxtData();
        await router.push("/backend");
    } catch {
        alert("保存失败");
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <section class="admin-page-wrapper panel write-panel">
        <h2>编辑文章</h2>
        <div v-if="pending" class="empty-state">加载中...</div>
        <form v-else class="write-form" @submit.prevent="onSubmit">
            <label class="field-label">
                <span>封面 URL</span>
                <input v-model="form.poster" class="field" type="url" />
            </label>
            <label class="field-label">
                <span>标题</span>
                <input v-model="form.articleTitle" class="field" type="text" />
            </label>
            <label class="field-label">
                <span>摘要</span>
                <textarea v-model="form.summary" class="textarea" rows="3" />
            </label>
            <label class="field-label">
                <span>私密</span>
                <select v-model.number="form.private" class="field">
                    <option :value="0">否</option>
                    <option :value="1">是</option>
                </select>
            </label>
            <label class="field-label">
                <span>正文（Markdown）</span>
                <textarea v-model="form.articleText" class="textarea md-input" rows="18" />
            </label>
            <button class="button" type="submit" :disabled="saving">{{ saving ? "保存中..." : "保存" }}</button>
        </form>
    </section>
</template>

<style scoped>
.write-panel {
    padding: 24px;
}

.write-form {
    display: grid;
    gap: 14px;
    margin-top: 16px;
}

.field-label {
    display: grid;
    gap: 6px;
    font-size: 14px;
}

.textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid var(--border);
    resize: vertical;
}

.md-input {
    font-family: ui-monospace, monospace;
    font-size: 13px;
}
</style>
