<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { throttle } from "lodash-es";

const config = useRuntimeConfig();
const { currentUser, logout } = useCurrentUser();

const isMenuVisible = ref(false);
const isAnimationEnabled = ref(false);
const isShowGoTopIcon = ref(false);
let hideTimer: number | null = null;

const onLogout = async () => {
    await logout();
    await navigateTo("/");
};

const onToggleMenu = () => {
    if (isAnimationEnabled.value === false) {
        isAnimationEnabled.value = true;
    }
    if (isMenuVisible.value) {
        hideMenu();
    } else {
        isMenuVisible.value = true;
        document.body.style.overflow = "hidden";
    }
};

const hideMenu = () => {
    isMenuVisible.value = false;
};

const onAnimationEnd = () => {
    if (isMenuVisible.value === false) {
        isAnimationEnabled.value = false;
        document.body.style.overflow = "";
    }
};

const onClickMask = () => {
    hideMenu();
};

const clearHideTimer = () => {
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
};

const setHideTimer = () => {
    clearHideTimer();
    hideTimer = window.setTimeout(() => {
        isShowGoTopIcon.value = false;
    }, 5000);
};

const onScroll = () => {
    const currScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (currScrollTop > 0) {
        isShowGoTopIcon.value = true;
        setHideTimer();
    } else {
        isShowGoTopIcon.value = false;
    }
};

const onScrollThrottle = throttle(onScroll, 300, { leading: true });

const addScrollListener = () => {
    document.addEventListener("scroll", onScrollThrottle, {
        passive: true,
    });
};

const removeScrollListener = () => {
    document.removeEventListener("scroll", onScrollThrottle);
};

const goToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

onMounted(() => {
    addScrollListener();
    setHideTimer();
});

onBeforeUnmount(() => {
    hideMenu();
    removeScrollListener();
    clearHideTimer();
});
</script>

<template>
    <section
        class="base-layout__wrapper"
        :class="{ slideInLeft: isMenuVisible, slideOutLeft: !isMenuVisible, 'animated faster': isAnimationEnabled }"
        @animationend="onAnimationEnd"
    >
        <header class="base-layout__header">
            <NuxtLink to="/" class="logo-wrap">
                <img src="~/assets/img/logo.png" alt="Logo" />
            </NuxtLink>
            <h3>一个坚持原创的前端分享驿站</h3>
            <div class="icons-wrapper">
                <button class="menu-toggle" @click="onToggleMenu">☰</button>
                <NuxtLink v-if="currentUser" to="/backend" class="adm-entry" title="进入后台">
                    <span>⚙️</span>
                </NuxtLink>
            </div>
        </header>

        <main class="base-layout__main">
            <slot />
        </main>

        <div class="hot-column">
            <HotArticles />
        </div>

        <footer class="base-layout__footer">
            <div class="footer-content">
                <p>© {{ new Date().getFullYear() }} 前端分享驿站</p>
                <p>Powered by Nuxt 4</p>
            </div>
        </footer>

        <div v-show="isMenuVisible" class="mask" @click="onClickMask"></div>

        <div v-show="isMenuVisible" class="base-menu">
            <nav class="menu-nav">
                <NuxtLink to="/" @click="hideMenu">首页</NuxtLink>
                <NuxtLink to="/categories" @click="hideMenu">分类</NuxtLink>
                <NuxtLink to="/tags" @click="hideMenu">标签</NuxtLink>
                <NuxtLink to="/timeline" @click="hideMenu">时间轴</NuxtLink>
                <NuxtLink to="/messages" @click="hideMenu">留言</NuxtLink>
                <NuxtLink to="/chat" @click="hideMenu">聊天室</NuxtLink>
                <NuxtLink to="/chatgpt" @click="hideMenu">ChatGPT</NuxtLink>
                <template v-if="currentUser">
                    <NuxtLink to="/backend" @click="hideMenu">后台</NuxtLink>
                    <button type="button" class="nav-text-btn" @click="onLogout">退出</button>
                </template>
                <NuxtLink v-else to="/login" @click="hideMenu">登录</NuxtLink>
            </nav>
        </div>

        <aside class="aside-icons">
            <button v-show="isShowGoTopIcon" class="icon--aside" @click="goToTop">↑</button>
        </aside>
    </section>
</template>

<style scoped>
.base-layout__header {
    padding: 18px 40px;
    background: linear-gradient(to bottom right, #2177a7, #5fb7ac);
    text-align: center;
    position: relative;
}

.base-layout__header > h3 {
    margin: 20px 0;
    color: #eaeab3;
    font-size: 20px;
    font-weight: 400;
    text-shadow:
        0 1px 0 #2e2e2e,
        0 2px 0 #2c2c2c,
        0 3px 0 #2a2a2a,
        0 4px 0 #282828,
        0 5px 0 #262626,
        0 6px 0 #242424;
}

.base-layout__main {
    padding: 24px 24px 0;
}

.logo-wrap {
    display: inline-block;
}

.logo-wrap img {
    height: 60px;
}

.icons-wrapper {
    position: absolute;
    top: 20px;
    left: 12px;
    display: flex;
    align-items: center;
}

.menu-toggle {
    font-size: 24px;
    color: #fff;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
}

.adm-entry {
    margin-left: 8px;
    font-size: 20px;
    color: #fff;
}

.mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 24%);
    z-index: 100;
}

.base-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: #fff;
    z-index: 101;
    padding: 24px;
    box-shadow: 2px 0 8px rgb(0 0 0 / 10%);
}

.menu-nav {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.menu-nav a {
    padding: 12px;
    border-radius: 8px;
    transition: background-color 0.3s;
}

.menu-nav a:hover {
    background-color: rgb(0 0 0 / 5%);
}

.nav-text-btn {
    padding: 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
    background: none;
    text-align: left;
    transition: background-color 0.3s;
}

.nav-text-btn:hover {
    background-color: rgb(0 0 0 / 5%);
}

.hot-column {
    padding: 24px;
    background: #f5f5f5;
    margin-top: 24px;
}

.base-layout__footer {
    background: #333;
    color: #fff;
    padding: 24px;
    text-align: center;
    margin-top: 24px;
}

.footer-content {
    max-width: 800px;
    margin: 0 auto;
}

.aside-icons {
    position: fixed;
    bottom: 160px;
    right: 24px;
    width: 50px;
    height: 50px;
}

.icon--aside {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #2177a7;
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
}

.slideInLeft {
    animation: slideInLeft 0.3s ease-out;
}

.slideOutLeft {
    animation: slideOutLeft 0.3s ease-in;
}

@keyframes slideInLeft {
    from {
        transform: translateX(280px);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes slideOutLeft {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(280px);
    }
}

@media screen and (width >= 992px) {
    .base-layout__main {
        width: 800px;
        margin: 0 auto;
    }

    .hot-column {
        width: 800px;
        margin: 24px auto 0;
        border-radius: 8px;
    }
}

@media screen and (width < 992px) {
    .base-layout__header {
        padding: 18px 24px;
    }
}
</style>
