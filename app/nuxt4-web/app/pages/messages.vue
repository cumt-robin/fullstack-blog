<script setup lang="ts">
const { data: stats, pending: statsPending } = await useMessageStats();
</script>

<template>
    <section class="stack messages-page">
        <div v-if="statsPending" class="empty-state panel">加载统计中...</div>
        <div v-else-if="stats" class="stats panel">
            <p class="msgs-stats">
                已有<strong class="user-count">{{ stats.userCount }}</strong
                >人在这留下了足迹
            </p>
            <p class="msgs-stats">
                留言总数：<strong class="user-count">{{ stats.messageTotal }}</strong
                >条
            </p>
        </div>

        <CommentSection topic="留言" />
    </section>
</template>

<style scoped>
.stats {
    padding: 16px 20px;
    margin-bottom: 20px;
}

.msgs-stats {
    font-size: 13px;
    color: var(--muted);
    text-align: center;
    margin: 0 0 10px;
}

.user-count {
    font-size: 16px;
    color: var(--text);
    font-weight: 700;
}
</style>
