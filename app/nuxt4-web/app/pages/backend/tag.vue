<script setup lang="ts">
import type { TagDTO } from "@fullstack-blog/types";
import { format } from "@fullstack-blog/utils";

const repositories = useRepositories();
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const list = ref<TagDTO[]>([]);
const loading = ref(false);

const fetchList = async () => {
    loading.value = true;
    try {
        const res = await repositories.tagRepository.adminPage({ pageNo: pageNo.value, pageSize });
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
</script>

<template>
    <section class="admin-page-wrapper">
        <div v-if="loading" class="empty-state panel">加载中...</div>
        <table v-else class="data-table">
            <thead>
                <tr>
                    <th>标签</th>
                    <th>时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in list" :key="row.id">
                    <td>{{ row.tag_name }}</td>
                    <td>{{ row.create_time ? format(row.create_time) : "—" }}</td>
                    <td>
                        <NuxtLink class="button button--small" :to="`/tag/${encodeURIComponent(row.tag_name)}`">文章</NuxtLink>
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
