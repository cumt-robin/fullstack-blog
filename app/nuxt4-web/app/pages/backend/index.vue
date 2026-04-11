<script setup lang="ts">
import type { ArticleDTO } from "@fullstack-blog/types";
import { format } from "@fullstack-blog/utils";

const repositories = useRepositories();

const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const list = ref<ArticleDTO[]>([]);
const loading = ref(false);
const busyIndex = ref(-1);
const privateLoading = ref(false);

const fetchList = async () => {
    loading.value = true;
    try {
        const res = await repositories.articleRepository.pageAdmin({ pageNo: pageNo.value, pageSize });
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

const togglePrivate = async (record: ArticleDTO, index: number) => {
    privateLoading.value = true;
    busyIndex.value = index;
    try {
        await repositories.articleRepository.updatePrivate({
            id: record.id,
            private: record.private === 0 ? 1 : 0,
        });
        await fetchList();
        await refreshNuxtData();
    } finally {
        privateLoading.value = false;
        busyIndex.value = -1;
    }
};

const toggleDeleted = async (record: ArticleDTO) => {
    if (!confirm(`确认要${record.deleted === 1 ? "逻辑恢复" : "逻辑删除"}吗？`)) {
        return;
    }
    await repositories.articleRepository.updateDeleted({
        id: record.id,
        deleted: record.deleted === 1 ? 0 : 1,
    });
    await fetchList();
    await refreshNuxtData();
};

const physicalDelete = async (record: ArticleDTO) => {
    if (!confirm("确认物理删除？不可恢复。")) {
        return;
    }
    await repositories.articleRepository.delete(record.id);
    await fetchList();
    await refreshNuxtData();
};
</script>

<template>
    <section class="admin-page-wrapper">
        <div class="admin-toolbar">
            <NuxtLink class="button" to="/backend/write">新建文章</NuxtLink>
        </div>
        <div v-if="loading" class="empty-state panel">加载中...</div>
        <table v-else class="data-table">
            <thead>
                <tr>
                    <th>标题</th>
                    <th>时间</th>
                    <th>阅读</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in list" :key="row.id">
                    <td>{{ row.article_name }}</td>
                    <td>{{ format(row.create_time) }}</td>
                    <td>{{ row.read_num }}</td>
                    <td>
                        <div class="admin-toolbar">
                            <button
                                type="button"
                                class="button button--small"
                                :disabled="privateLoading && busyIndex === index"
                                @click="togglePrivate(row, index)"
                            >
                                {{ row.private === 1 ? "公开" : "私密" }}
                            </button>
                            <NuxtLink class="button button--small" :to="`/backend/article/edit/${row.id}`">编辑</NuxtLink>
                            <button type="button" class="button button--small" @click="toggleDeleted(row)">
                                {{ row.deleted === 1 ? "恢复" : "删" }}
                            </button>
                            <button type="button" class="button button--small button--danger" @click="physicalDelete(row)">物理删除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="admin-pagination">
            <button type="button" class="button button--small" :disabled="pageNo <= 1" @click="setPage(pageNo - 1)">上一页</button>
            <span>第 {{ pageNo }} / {{ totalPages }} 页（共 {{ total }} 条）</span>
            <button type="button" class="button button--small" :disabled="pageNo >= totalPages" @click="setPage(pageNo + 1)">下一页</button>
        </div>
    </section>
</template>
