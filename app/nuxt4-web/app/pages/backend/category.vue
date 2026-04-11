<script setup lang="ts">
import type { CategoryDTO } from "@fullstack-blog/types";
import { format } from "@fullstack-blog/utils";

const repositories = useRepositories();
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const list = ref<CategoryDTO[]>([]);
const loading = ref(false);

const editing = ref<CategoryDTO | null>(null);
const editForm = reactive({ category_name: "", poster: "" });

const fetchList = async () => {
    loading.value = true;
    try {
        const res = await repositories.categoryRepository.adminPage({ pageNo: pageNo.value, pageSize });
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

const openEdit = (row: CategoryDTO) => {
    editing.value = row;
    editForm.category_name = row.category_name;
    editForm.poster = row.poster || "";
};

const saveEdit = async () => {
    if (!editing.value) {
        return;
    }
    await repositories.categoryRepository.adminUpdate({
        id: editing.value.id,
        category_name: editForm.category_name,
        poster: editForm.poster,
    });
    editing.value = null;
    await fetchList();
    await refreshNuxtData();
};
</script>

<template>
    <section class="admin-page-wrapper">
        <div v-if="loading" class="empty-state panel">加载中...</div>
        <table v-else class="data-table">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>封面</th>
                    <th>时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in list" :key="row.id">
                    <td>{{ row.category_name }}</td>
                    <td>
                        <img
                            v-if="row.poster"
                            :src="row.poster"
                            alt=""
                            style="width: 80px; height: 50px; object-fit: cover; border-radius: 8px"
                        />
                    </td>
                    <td>{{ format(row.create_time) }}</td>
                    <td>
                        <button type="button" class="button button--small" @click="openEdit(row)">编辑</button>
                        <NuxtLink class="button button--small" :to="`/category/${encodeURIComponent(row.category_name)}`">文章</NuxtLink>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="admin-pagination">
            <button type="button" class="button button--small" :disabled="pageNo <= 1" @click="setPage(pageNo - 1)">上一页</button>
            <span>第 {{ pageNo }} / {{ totalPages }} 页</span>
            <button type="button" class="button button--small" :disabled="pageNo >= totalPages" @click="setPage(pageNo + 1)">下一页</button>
        </div>

        <div v-if="editing" class="panel edit-modal">
            <h3>编辑分类</h3>
            <label class="field-label">
                <span>名称</span>
                <input v-model="editForm.category_name" class="field" type="text" />
            </label>
            <label class="field-label">
                <span>封面 URL</span>
                <input v-model="editForm.poster" class="field" type="url" />
            </label>
            <div class="admin-toolbar">
                <button type="button" class="button" @click="saveEdit">保存</button>
                <button type="button" class="button" @click="editing = null">取消</button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.edit-modal {
    margin-top: 20px;
    padding: 20px;
    display: grid;
    gap: 12px;
}

.field-label {
    display: grid;
    gap: 6px;
    font-size: 14px;
}
</style>
