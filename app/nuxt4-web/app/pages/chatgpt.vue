<script setup lang="ts">
const repositories = useRepositories();
const wd = ref("");
const answer = ref("");
const loading = ref(false);

const ask = async () => {
    if (!wd.value.trim()) {
        return;
    }
    loading.value = true;
    answer.value = "";
    try {
        const res = await repositories.chatgptRepository.chatV1(wd.value.trim());
        answer.value = res.data;
    } catch {
        answer.value = "请求失败，请稍后重试。";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <section class="panel chatgpt-page">
        <p class="eyebrow">ChatGPT</p>
        <h2>AI 对话（v1）</h2>
        <div class="row">
            <input v-model="wd" class="field" type="text" placeholder="输入问题" @keyup.enter="ask" />
            <button class="button" type="button" :disabled="loading" @click="ask">{{ loading ? "思考中..." : "发送" }}</button>
        </div>
        <article v-if="answer" class="answer">{{ answer }}</article>
    </section>
</template>

<style scoped>
.chatgpt-page {
    padding: 24px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
}

.row .field {
    flex: 1;
    min-width: 200px;
}

.answer {
    margin-top: 20px;
    padding: 16px;
    border-radius: 16px;
    background: var(--surface-alt);
    white-space: pre-wrap;
    line-height: 1.6;
}
</style>
