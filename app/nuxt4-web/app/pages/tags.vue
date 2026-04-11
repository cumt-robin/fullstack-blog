<script setup lang="ts">
const { data, pending } = await useTagsPage();
</script>

<template>
    <section class="panel tags-panel">
        <p class="eyebrow">Tags</p>
        <h2>所有标签</h2>
        <div v-if="pending" class="empty-state">加载标签中...</div>
        <div v-else-if="data?.length" class="tag-grid">
            <NuxtLink v-for="tag in data" :key="tag.id" class="tag-chip" :to="`/tag/${encodeURIComponent(tag.tag_name)}`">
                <strong>{{ tag.tag_name }}</strong>
                <span class="muted">{{ tag.tag_count ?? 0 }} 篇</span>
            </NuxtLink>
        </div>
        <div v-else class="empty-state">暂无标签。</div>
    </section>
</template>

<style scoped>
.tags-panel {
    padding: 24px;
}

.tag-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 18px;
}

.tag-chip {
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 16px;
    border-radius: 16px;
    background: color-mix(in srgb, var(--surface-alt) 72%, white);
    border: 1px solid var(--border);
}
</style>
