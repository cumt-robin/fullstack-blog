<script setup lang="ts">
const props = defineProps<{
    pageNo: number;
    pageSize: number;
    total: number;
}>();

const emit = defineEmits<{
    update: [page: number];
}>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
</script>

<template>
    <nav v-if="totalPages > 1" class="pagination">
        <button class="button secondary" :disabled="pageNo <= 1" @click="emit('update', pageNo - 1)">上一页</button>
        <span>第 {{ pageNo }} / {{ totalPages }} 页</span>
        <button class="button secondary" :disabled="pageNo >= totalPages" @click="emit('update', pageNo + 1)">下一页</button>
    </nav>
</template>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
}
</style>
