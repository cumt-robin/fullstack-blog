<script setup lang="ts">
definePageMeta({
    middleware: "auth",
});
</script>

<template>
    <div class="container backend-layout">
        <nav class="backend-nav panel">
            <NuxtLink to="/backend">文章</NuxtLink>
            <NuxtLink to="/backend/write">写作</NuxtLink>
            <NuxtLink to="/backend/all-msg">所有留言</NuxtLink>
            <NuxtLink to="/backend/review-msg">审核留言</NuxtLink>
            <NuxtLink to="/backend/review-msg-reply">审核留言回复</NuxtLink>
            <NuxtLink to="/backend/all-comment">所有评论</NuxtLink>
            <NuxtLink to="/backend/review-comment">审核评论</NuxtLink>
            <NuxtLink to="/backend/review-comment-reply">审核评论回复</NuxtLink>
            <NuxtLink to="/backend/category">分类</NuxtLink>
            <NuxtLink to="/backend/tag">标签</NuxtLink>
            <NuxtLink to="/">前台首页</NuxtLink>
        </nav>
        <NuxtPage />
    </div>
</template>
