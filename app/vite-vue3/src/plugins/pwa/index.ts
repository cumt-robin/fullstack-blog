import { useRegisterSW } from "virtual:pwa-register/vue";
import { watch } from "vue";
import { message, Modal } from "ant-design-vue";

export function usePWA() {
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
        immediate: true,
        onRegisteredSW(_swUrl, r) {
            if (r) {
                setInterval(
                    async () => {
                        await r.update();
                    },
                    60 * 60 * 1000,
                );
            }
        },
        onRegisterError(error) {
            console.error("Service Worker registration error:", error);
        },
    });

    watch(offlineReady, (value) => {
        if (value) {
            message.success("应用已准备好离线使用", 3);
        }
    });

    watch(needRefresh, (value) => {
        if (value) {
            Modal.confirm({
                title: "发现新版本",
                content: "检测到新版本可用，是否立即更新？",
                okText: "立即更新",
                cancelText: "稍后更新",
                onOk: async () => {
                    await updateServiceWorker(true);
                },
            });
        }
    });

    return {
        offlineReady,
        needRefresh,
        updateServiceWorker,
    };
}
