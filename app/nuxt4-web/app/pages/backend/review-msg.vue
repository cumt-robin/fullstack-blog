<script setup lang="ts">
import type { CommentDTO } from "@fullstack-blog/types";

const repositories = useRepositories();
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const list = ref<CommentDTO[]>([]);
const loading = ref(false);

const fetchList = async () => {
    loading.value = true;
    try {
        const res = await repositories.commentRepository.pageNotApproved({ pageNo: pageNo.value, pageSize, type: 2 });
        list.value = res.data;
        total.value = res.total;
    } finally {
        loading.value = false;
    }
};

await fetchList();

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));

const setPage = async (p: number) => {
    pageNo.value = p;
    await fetchList();
};

const review = async (row: CommentDTO, approved: 1 | 2) => {
    if (!confirm(`确认审核为「${approved === 1 ? "通过" : "不通过"}」？`)) {
        return;
    }
    await repositories.commentRepository.review({
        id: row.id,
        approved,
        email: row.email,
        content: row.content,
        jump_url: row.jump_url,
    });
    await fetchList();
};
</script>

<template>
    <section class="admin-page-wrapper">
        <div v-if="loading" class="empty-state panel">加载中...</div>
        <table v-else class="data-table">
            <thead>
                <tr>
                    <th>昵称</th>
                    <th>内容</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in list" :key="row.id">
                    <td>{{ row.nick_name }}</td>
                    <td>{{ row.content }}</td>
                    <td>
                        <button type="button" class="button button--small" @click="review(row, 1)">通过</button>
                        <button type="button" class="button button--small button--danger" @click="review(row, 2)">不通过</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="admin-pagination">
            <button type="button" class="button button--small" :disabled="pageNo <= 1" @click="setPage(pageNo - 1)">上一页</button>
            <span>第 {{ pageNo }} / {{ totalPages }} 页</span>
            <button type="button" class="button button--small" :disabled="pageNo >= totalPages" @click="setPage(pageNo + 1)">下一页</button>
        </div>
    </section>
</template>
