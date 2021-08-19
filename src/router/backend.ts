/**
 * @author: Tusi
 * @description: 后台路由
 */

import { RouteRecordRaw } from "vue-router";

export const backendRoute: RouteRecordRaw = {
    path: "/backend",
    name: "Backend",
    component: () => import(/* webpackChunkName: "backend" */ "@/views/backend/index.vue"),
    meta: {
        auth: true,
        isAdmin: true,
    },
    children: [
        // 文章
        {
            path: "",
            component: () => import(/* webpackChunkName: "backend-article" */ "@/views/backend/article/index.vue"),
            meta: {
                title: "所有文章",
            },
        },
        {
            path: "write",
            component: () => import(/* webpackChunkName: "write" */ "@/views/backend/write/index.vue"),
            meta: {
                title: "开始创作",
            },
        },
        {
            path: "article/edit/:id",
            component: () => import(/* webpackChunkName: "article-edit" */ "@/views/backend/write/index.vue"),
            meta: {
                title: "修改文章",
            },
        },
        // 留言
        {
            path: "all-msg",
            component: () => import(/* webpackChunkName: "all-msg" */ "@/views/backend/msg/all/index.vue"),
            meta: {
                title: "所有留言",
            },
        },
        {
            path: "review-msg",
            component: () => import(/* webpackChunkName: "review-msg" */ "@/views/backend/msg/review/index.vue"),
            meta: {
                title: "审核留言",
            },
        },
        {
            path: "review-msg-reply",
            component: () => import(/* webpackChunkName: "review-msg-reply" */ "@/views/backend/msg/review-reply/index.vue"),
            meta: {
                title: "审核留言回复",
            },
        },
        // 评论
        {
            path: "all-comment",
            component: () => import(/* webpackChunkName: "all-comment" */ "@/views/backend/comment/all/index.vue"),
            meta: {
                title: "所有评论",
            },
        },
        {
            path: "review-comment",
            component: () => import(/* webpackChunkName: "review-comment" */ "@/views/backend/comment/review/index.vue"),
            meta: {
                title: "审核评论",
            },
        },
        {
            path: "review-comment-reply",
            component: () => import(/* webpackChunkName: "review-comment-reply" */ "@/views/backend/comment/review-reply/index.vue"),
            meta: {
                title: "审核评论回复",
            },
        },
    ],
};
