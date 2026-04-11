<script setup lang="ts">
const repositories = useRepositories();
const router = useRouter();

const form = reactive({
    articleTitle: "",
    articleText: "",
    summary: "",
    poster: "",
    private: 0 as 0 | 1,
    tagsInput: "随笔",
});

const saving = ref(false);

const parsedTags = computed(() =>
    form.tagsInput
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
);

const onSubmit = async () => {
    if (!form.articleTitle || !form.articleText || !form.summary || !form.poster) {
        alert("请填写标题、摘要、封面与正文");
        return;
    }
    const tags = parsedTags.value;
    if (!tags.length) {
        alert("至少填写一个标签");
        return;
    }
    saving.value = true;
    try {
        await repositories.articleRepository.add({
            articleTitle: form.articleTitle,
            articleText: form.articleText,
            summary: form.summary,
            poster: form.poster,
            private: form.private,
            tags,
            newCategories: [],
            oldCategoryIds: [],
        });
        await refreshNuxtData();
        await router.push("/backend");
    } catch {
        alert("发布失败");
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <section class="admin-page-wrapper panel write-panel">
        <h2>发布文章</h2>
        <form class="write-form" @submit.prevent="onSubmit">
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
                <span>标签（逗号分隔）</span>
                <input v-model="form.tagsInput" class="field" type="text" />
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
            <button class="button" type="submit" :disabled="saving">{{ saving ? "提交中..." : "发布" }}</button>
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
