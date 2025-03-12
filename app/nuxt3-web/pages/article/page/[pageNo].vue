<template>
    <div>{{ pageNo }}</div>
</template>

<script lang="ts" setup>
const route = useRoute();
const pageNo = route.params.pageNo;

const { data } = await useGet("/article/page", { pageNo }, { key: `article-page-${pageNo}` });

console.log("data", data.value);
</script>
