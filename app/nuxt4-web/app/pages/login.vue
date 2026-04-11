<script setup lang="ts">
import { format } from "@fullstack-blog/utils";
import { sha256Hex } from "~/lib/sha256-hex";

definePageMeta({ layout: false });

const route = useRoute();
const { login, refreshCurrentUser } = useCurrentUser();
const repositories = useRepositories();

const formModel = reactive({
    userName: "",
    password: "",
    captcha: "",
});

const svgHtml = ref("");
const loading = ref(false);
const errorMessage = ref("");

const loadCaptcha = async () => {
    try {
        const res = await repositories.validatorRepository.imgCode();
        svgHtml.value = res.data;
    } catch {
        svgHtml.value = "";
    }
};

await loadCaptcha();

const onSubmit = async () => {
    errorMessage.value = "";
    if (!formModel.userName || !formModel.password || !formModel.captcha) {
        errorMessage.value = "?????????????";
        return;
    }
    loading.value = true;
    try {
        const hashed = await sha256Hex(formModel.password);
        const user = await login({
            ...formModel,
            password: hashed,
        });
        await refreshCurrentUser();
        const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/backend";
        if (import.meta.client && user?.last_login_time) {
            alert(`????????????${format(user.last_login_time, "YYYY-MM-DD HH:mm")}`);
        }
        await navigateTo(redirect || "/backend");
    } catch {
        errorMessage.value = "??????????????";
        await loadCaptcha();
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="login-shell">
        <div class="login-card panel">
            <h2>????</h2>
            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
            <form class="login-form" @submit.prevent="onSubmit">
                <label class="field-label">
                    <span>???</span>
                    <input v-model="formModel.userName" class="field" type="text" autocomplete="username" />
                </label>
                <label class="field-label">
                    <span>??</span>
                    <input v-model="formModel.password" class="field" type="password" autocomplete="current-password" />
                </label>
                <label class="field-label captcha-row">
                    <span>???</span>
                    <div class="captcha-inline">
                        <input v-model="formModel.captcha" class="field" type="text" />
                        <div class="verify-code" @click="loadCaptcha" v-html="svgHtml" />
                    </div>
                </label>
                <button class="button" type="submit" :disabled="loading">{{ loading ? "???..." : "??" }}</button>
            </form>
            <p class="back-home">
                <NuxtLink to="/">????</NuxtLink>
            </p>
        </div>
    </div>
</template>

<style scoped>
.login-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
}

.login-card {
    width: 100%;
    max-width: 420px;
    padding: 28px;
}

.login-card h2 {
    text-align: center;
    margin: 0 0 20px;
}

.login-form {
    display: grid;
    gap: 14px;
}

.field-label {
    display: grid;
    gap: 6px;
    font-size: 14px;
}

.captcha-inline {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
}

.verify-code {
    cursor: pointer;
    min-height: 40px;
    display: flex;
    align-items: center;
}

.verify-code :deep(svg) {
    display: block;
    max-height: 40px;
}

.error-text {
    color: #b91c1c;
    font-size: 14px;
    margin: 0 0 12px;
}

.back-home {
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
}
</style>
