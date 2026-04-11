/**
 * Client-only push 订阅状态占位，与 vite-vue3 `usePushSubscription` 对齐时可在此实现。
 */
export const usePushSubscription = () => {
    const showGuide = ref(false);
    const permission = ref<PermissionState | "unsupported">("unsupported");
    const isSubscribing = ref(false);
    const isSubscribed = ref(false);

    const requestAndSubscribe = async () => {};
    const dismissGuide = () => {
        showGuide.value = false;
    };
    const unsubscribeCurrentClient = async () => {};

    return {
        showGuide,
        permission,
        isSubscribing,
        isSubscribed,
        requestAndSubscribe,
        dismissGuide,
        unsubscribeCurrentClient,
    };
};
