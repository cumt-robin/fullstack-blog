/**
 * @author: Tusi
 * @description: 路由配置
 */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Cookies from "js-cookie";
import { backendRoute } from "./backend";
import { FALLBACK_ROUTE, NOT_FOUND_ROUTE } from "./not-found";
import store from "@/store";
import { SET_USER_INFO } from "@/store/constants";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: () => import(/* webpackChunkName: "home" */ "@/views/home/index.vue"),
        meta: {
            auth: false,
            title: "首页",
        },
    },
    {
        path: "/categories",
        name: "Categoryies",
        component: () => import(/* webpackChunkName: "categories" */ "@/views/categories/index.vue"),
        meta: {
            auth: false,
            title: "所有分类",
        },
    },
    {
        path: "/category/:name",
        name: "Category",
        component: () => import(/* webpackChunkName: "category" */ "@/views/category/index.vue"),
        meta: {
            auth: false,
            title: "分类",
        },
    },
    {
        path: "/tags",
        name: "Tags",
        component: () => import(/* webpackChunkName: "tags" */ "@/views/tags/index.vue"),
        meta: {
            auth: false,
            title: "所有标签",
        },
    },
    {
        path: "/tag/:name",
        name: "Tag",
        component: () => import(/* webpackChunkName: "tag" */ "@/views/tag/index.vue"),
        meta: {
            auth: false,
            title: "标签",
        },
    },
    {
        path: "/timeline",
        name: "Timeline",
        component: () => import(/* webpackChunkName: "timeline" */ "@/views/timeline/index.vue"),
        meta: {
            auth: false,
            title: "时间轴",
        },
    },
    {
        path: "/article/:id",
        name: "Article",
        component: () => import(/* webpackChunkName: "article" */ "@/views/article/index.vue"),
        meta: {
            auth: false,
            title: "文章详情",
        },
    },
    {
        path: "/jumpout/:target",
        name: "Jumpout",
        component: () => import(/* webpackChunkName: "jumpout" */ "@/views/jumpout/index.vue"),
        meta: {
            auth: false,
            title: "即将离开博客",
        },
    },
    {
        path: "/messages",
        name: "Messages",
        component: () => import(/* webpackChunkName: "messages" */ "@/views/messages/index.vue"),
        meta: {
            auth: false,
            title: "留言",
        },
    },
    {
        path: "/chat",
        name: "Chat",
        component: () => import(/* webpackChunkName: "chat" */ "@/views/chat/index.vue"),
        meta: {
            auth: false,
            title: "在线聊天室",
        },
    },
    {
        path: "/login",
        name: "Login",
        component: () => import(/* webpackChunkName: "login" */ "@/views/login/index.vue"),
        meta: {
            auth: false,
            title: "登录",
        },
    },
    {
        path: "/chatgpt",
        name: "ChatGpt",
        component: () => import(/* webpackChunkName: "chatgpt" */ "@/views/chatgpt/index.vue"),
        meta: {
            auth: false,
            title: "ChatGpt AI对话",
        },
    },
    backendRoute,
    NOT_FOUND_ROUTE,
    FALLBACK_ROUTE,
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

const clearUserInfo = () => {
    store.commit(SET_USER_INFO, null);
};

router.beforeEach((to, from, next) => {
    // 基本校验
    if (to.meta.auth) {
        // 需要鉴权的页面，进行前端检查，主要检查cookie中有没有标志位islogined
        // 后端依旧需要对需要鉴权的接口访问做校验，不能依赖前端的判定
        const isLogined = Cookies.get("islogined");
        if (isLogined === "1") {
            next();
        } else {
            clearUserInfo();
            next("/login");
        }
    } else {
        next();
    }
});

export default router;
