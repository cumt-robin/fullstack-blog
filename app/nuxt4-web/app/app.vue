<script setup lang="ts">
const { refreshCurrentUser } = useCurrentUser();

await useAsyncData("bootstrap-current-user", () => refreshCurrentUser({ suppressAuthError: true, suppressErrors: true }));
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
