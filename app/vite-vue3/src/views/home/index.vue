<!--
 * @author: Tusi
 * @description: 首页
-->
<template>
    <base-layout>
        <section v-if="showGuide" class="push-guide">
            <a-alert type="info" show-icon :message="guideMessage">
                <template #description>
                    <div class="push-guide__content">
                        <span>{{ guideDescription }}</span>
                        <a-space>
                            <a-button size="small" type="primary" :loading="isSubscribing" @click="onEnablePush">开启通知</a-button>
                            <a-button size="small" @click="onCloseGuide">暂不提醒</a-button>
                        </a-space>
                    </div>
                </template>
            </a-alert>
        </section>
        <section v-else-if="isSubscribed" class="push-guide">
            <a-alert type="success" show-icon message="你已开启文章通知">
                <template #description>
                    <a-button size="small" @click="onDisablePush">关闭通知</a-button>
                </template>
            </a-alert>
        </section>

        <a-skeleton :loading="loading" active :paragraph="{ rows: 12 }">
            <template v-if="articleList.length > 0">
                <section class="article-list">
                    <card-article v-for="article in articleList" :key="article.id" :article="article" />
                </section>

                <a-pagination
                    class="pagination-common"
                    v-model:current="pageInfo.pageNo"
                    v-model:page-size="pageInfo.pageSize"
                    :total="total"
                    show-less-items
                    simple
                    @change="onPageNoChange"
                />
            </template>

            <template v-else>
                <a-empty />
            </template>
        </a-skeleton>
    </base-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { LocationQuery, useRoute, useRouter } from "vue-router";
import { setScrollTop } from "@fullstack-blog/utils";
import { articleService } from "@fullstack-blog/services";
import { ArticleDTO } from "@fullstack-blog/types";
import { message } from "ant-design-vue";
import { useAsyncLoading } from "@/hooks/async";
import { usePushSubscription } from "@/plugins/push";
import CardArticle from "@/components/card/card-article.vue";

const route = useRoute();
const router = useRouter();

const articleList = ref<ArticleDTO[]>([]);
const { showGuide, permission, isSubscribing, isSubscribed, requestAndSubscribe, dismissGuide, unsubscribeCurrentClient } =
    usePushSubscription();

const pageInfo = reactive({
    pageNo: 1,
    pageSize: 6,
});

const total = ref(0);

const handleGetArticleList = async (isChangePage: boolean) => {
    const res = await articleService.page(pageInfo);
    articleList.value = res.data;
    total.value = res.total;
    if (isChangePage) {
        setScrollTop({
            useAnimation: true,
            duration: 0.3,
        });
    }
};

const { trigger: getPageList, loading } = useAsyncLoading(handleGetArticleList);

watch(
    () => route.query,
    (val: LocationQuery, oldVal) => {
        const { pageNo } = val;
        if (pageNo) {
            pageInfo.pageNo = Number(pageNo);
        } else {
            pageInfo.pageNo = 1;
        }
        const isChangePage = pageNo !== oldVal?.pageNo;
        getPageList(isChangePage);
    },
    {
        immediate: true,
    },
);

const onPageNoChange = (page: number) => {
    router.push({ query: { pageNo: String(page) } });
};

const guideMessage = computed(() => {
    return permission.value === "denied" ? "浏览器通知权限已关闭" : "开启文章更新通知";
});

const guideDescription = computed(() => {
    return permission.value === "denied"
        ? "请在浏览器网站设置中开启通知权限，然后点击下方按钮重新订阅。"
        : "订阅后你会在新文章发布或文章更新时收到通知提醒。";
});

const onEnablePush = async () => {
    await requestAndSubscribe();
    if (permission.value === "denied") {
        message.warning("通知权限被关闭了，请在网站设置中允许通知后再试。");
    }
};

const onCloseGuide = () => {
    dismissGuide();
};

const onDisablePush = async () => {
    await unsubscribeCurrentClient();
};
</script>

<style lang="scss" scoped>
.push-guide {
    margin-bottom: 16px;
}

.push-guide__content {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
}

@media screen and (width <= 768px) {
    .push-guide__content {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
