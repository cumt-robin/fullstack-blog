<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const route = useRoute();
const router = useRouter();
const pageNo = computed(() => Math.max(1, Number(route.query.pageNo || 1)));
const pageSize = 6;

const { data, pending } = await useHomeArticles(pageSize);
const { showGuide, permission, isSubscribing, isSubscribed, requestAndSubscribe, dismissGuide, unsubscribeCurrentClient } = usePushSubscription();

const updatePage = (page: number) => router.push({ query: { pageNo: String(page) } });

const guideMessage = computed(() => {
    return permission.value === 'denied' ? '浏览器通知权限已关闭' : '开启文章更新通知';
});

const guideDescription = computed(() => {
    return permission.value === 'denied'
        ? '请在浏览器网站设置中开启通知权限，然后点击下方按钮重新订阅。'
        : '订阅后你会在新文章发布或文章更新时收到通知提醒。';
});

const onEnablePush = async () => {
    await requestAndSubscribe();
};

const onCloseGuide = () => {
    dismissGuide();
};

const onDisablePush = async () => {
    await unsubscribeCurrentClient();
};
</script>

<template>
    <section class="stack">
        <div v-if="showGuide" class="push-guide">
            <div class="alert alert-info">
                <div class="alert-content">
                    <h4>{{ guideMessage }}</h4>
                    <div class="push-guide__content">
                        <span>{{ guideDescription }}</span>
                        <div class="button-group">
                            <button class="btn btn-primary" :disabled="isSubscribing" @click="onEnablePush">
                                {{ isSubscribing ? '订阅中...' : '开启通知' }}
                            </button>
                            <button class="btn btn-default" @click="onCloseGuide">暂不提醒</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="isSubscribed" class="push-guide">
            <div class="alert alert-success">
                <div class="alert-content">
                    <h4>你已开启文章通知</h4>
                    <button class="btn btn-default" @click="onDisablePush">关闭通知</button>
                </div>
            </div>
        </div>

        <div v-if="pending" class="loading-state">加载文章中...</div>
        <template v-else-if="data?.data?.length">
            <section class="article-list">
                <ArticleCard v-for="article in data.data" :key="article.id" :article="article" />
            </section>
            <PaginationNav :page-no="pageNo" :page-size="pageSize" :total="data.total" @update="updatePage" />
        </template>
        <div v-else class="empty-state">暂无文章。</div>
    </section>
</template>

<style scoped>
.push-guide {
    margin-bottom: 16px;
}

.alert {
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
}

.alert-info {
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    color: #1890ff;
}

.alert-success {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    color: #52c41a;
}

.alert-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.push-guide__content {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
}

.button-group {
    display: flex;
    gap: 8px;
}

.btn {
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
}

.btn-primary {
    background-color: #1890ff;
    border-color: #1890ff;
    color: #fff;
}

.btn-primary:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
}

.btn-default:hover {
    border-color: #1890ff;
    color: #1890ff;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.loading-state {
    text-align: center;
    padding: 40px 0;
    color: #666;
}

.empty-state {
    text-align: center;
    padding: 40px 0;
    color: #666;
}

.article-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

@media screen and (width <= 768px) {
    .push-guide__content {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .button-group {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>
