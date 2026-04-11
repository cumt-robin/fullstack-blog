import { computed, ref } from "vue";
import { pushSubscriptionService } from "@fullstack-blog/services";
import { PushPermissionState, SubscribePushModel } from "@fullstack-blog/types";

const CHECK_DELAY_MS = 4000;
const SUBSCRIPTION_SYNC_FINGERPRINT_KEY = "push_subscription_sync_fingerprint";
const PUSH_DEBUG_FLAG_KEY = "push_debug";

const permission = ref<PushPermissionState>("unsupported");
const isSupported = ref(false);
const isSubscribed = ref(false);
const isInitializing = ref(false);
const isSubscribing = ref(false);
const isPromptDismissed = ref(false);

const showGuide = computed(() => {
    if (!isSupported.value || isPromptDismissed.value) {
        return false;
    }
    return !isSubscribed.value;
});

const isPushDebugEnabled = () => {
    // if (!import.meta.env.DEV) {
    //     return false;
    // }
    return localStorage.getItem(PUSH_DEBUG_FLAG_KEY) === "1";
};

const debugLog = (message: string, extra?: unknown) => {
    if (!isPushDebugEnabled()) {
        return;
    }
    if (extra === undefined) {
        // eslint-disable-next-line no-console
        console.debug(`[push-debug] ${message}`);
        return;
    }
    // eslint-disable-next-line no-console
    console.debug(`[push-debug] ${message}`, extra);
};

const toBase64 = (buffer: ArrayBuffer | null): string => {
    if (!buffer) {
        return "";
    }
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((item) => {
        binary += String.fromCharCode(item);
    });
    return btoa(binary);
};

const urlBase64ToArrayBuffer = (base64String: string): ArrayBuffer => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    const buffer = new ArrayBuffer(outputArray.byteLength);
    new Uint8Array(buffer).set(outputArray);
    return buffer;
};

const toPayload = (subscription: PushSubscription): SubscribePushModel => {
    const json = subscription.toJSON();
    const p256dh = json.keys?.p256dh || toBase64(subscription.getKey("p256dh"));
    const auth = json.keys?.auth || toBase64(subscription.getKey("auth"));
    return {
        endpoint: subscription.endpoint,
        p256dh,
        auth,
        userAgent: navigator.userAgent,
    };
};

const getRegistration = async () => {
    if (!("serviceWorker" in navigator)) {
        return null;
    }
    return navigator.serviceWorker.ready;
};

const getBindKey = () => {
    const token = localStorage.getItem("token");
    return token ? `auth:${token}` : "anon";
};

const getSyncFingerprint = (payload: SubscribePushModel) => {
    return JSON.stringify({
        endpoint: payload.endpoint,
        p256dh: payload.p256dh,
        auth: payload.auth,
        bindKey: getBindKey(),
    });
};

const setSyncedFingerprint = (payload: SubscribePushModel) => {
    localStorage.setItem(SUBSCRIPTION_SYNC_FINGERPRINT_KEY, getSyncFingerprint(payload));
    debugLog("set synced fingerprint");
};

const clearSyncedFingerprint = () => {
    localStorage.removeItem(SUBSCRIPTION_SYNC_FINGERPRINT_KEY);
    debugLog("clear synced fingerprint");
};

const shouldSync = (payload: SubscribePushModel, force: boolean) => {
    if (force) {
        debugLog("should sync: force=true");
        return true;
    }
    const lastSynced = localStorage.getItem(SUBSCRIPTION_SYNC_FINGERPRINT_KEY);
    const current = getSyncFingerprint(payload);
    const changed = lastSynced !== current;
    debugLog("should sync: fingerprint compare", { changed, hasLast: !!lastSynced });
    return changed;
};

const syncSubscription = async (subscription: PushSubscription, options: { force?: boolean } = {}) => {
    const payload = toPayload(subscription);
    const force = options.force || false;

    if (shouldSync(payload, force)) {
        debugLog("sync subscription: call backend subscribe");
        await pushSubscriptionService.subscribe(payload);
        setSyncedFingerprint(payload);
    } else {
        debugLog("sync subscription: skipped (no change)");
    }

    isSubscribed.value = true;
};

const syncCurrentSubscription = async (options: { force?: boolean } = {}) => {
    const registration = await getRegistration();
    if (!registration) {
        return;
    }

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        isSubscribed.value = false;
        debugLog("sync current subscription: no existing browser subscription");
        return;
    }

    debugLog("sync current subscription: found existing subscription");
    await syncSubscription(subscription, options);
};

const doSubscribe = async () => {
    const publicKey = import.meta.env.VITE_APP_WEB_PUSH_PUBLIC_KEY as string | undefined;
    if (!publicKey) {
        debugLog("subscribe aborted: missing VITE_APP_WEB_PUSH_PUBLIC_KEY");
        return false;
    }

    const registration = await getRegistration();
    if (!registration) {
        return false;
    }

    const existing = await registration.pushManager.getSubscription();
    if (existing) {
        debugLog("subscribe: reusing existing subscription");
        await syncSubscription(existing, { force: true });
        return true;
    }

    debugLog("subscribe: creating new subscription via pushManager.subscribe");
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToArrayBuffer(publicKey),
    });
    await syncSubscription(subscription, { force: true });
    return true;
};

const requestAndSubscribe = async () => {
    if (!isSupported.value || isSubscribing.value) {
        debugLog("requestAndSubscribe skipped", { isSupported: isSupported.value, isSubscribing: isSubscribing.value });
        return;
    }

    isSubscribing.value = true;
    try {
        const current = Notification.permission as PushPermissionState;
        const finalPermission = current === "default" ? ((await Notification.requestPermission()) as PushPermissionState) : current;
        permission.value = finalPermission;
        debugLog("notification permission result", { current, finalPermission });
        if (finalPermission !== "granted") {
            isSubscribed.value = false;
            return;
        }
        await doSubscribe();
    } finally {
        isSubscribing.value = false;
    }
};

const unsubscribeCurrentClient = async () => {
    const registration = await getRegistration();
    if (!registration) {
        return;
    }

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        isSubscribed.value = false;
        debugLog("unsubscribe skipped: no existing browser subscription");
        return;
    }

    debugLog("unsubscribe: call backend + browser unsubscribe");
    await pushSubscriptionService.unsubscribe({ endpoint: subscription.endpoint });
    await subscription.unsubscribe();
    clearSyncedFingerprint();
    isSubscribed.value = false;
    isPromptDismissed.value = false;
};

const getCurrentSubscriptionEndpoint = async () => {
    const registration = await getRegistration();
    if (!registration) {
        return "";
    }

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        debugLog("get endpoint skipped: no existing browser subscription");
        return "";
    }

    return subscription.endpoint;
};

const unbindCurrentClientByDevice = async () => {
    const endpoint = await getCurrentSubscriptionEndpoint();
    debugLog("unbind by device: call backend unbind-by-device", { hasEndpoint: !!endpoint });
    await pushSubscriptionService.unbindByDevice(endpoint ? { endpoint } : {});
};

const dismissGuide = () => {
    isPromptDismissed.value = true;
};

const initPushSubscription = async () => {
    if (isInitializing.value) {
        return;
    }

    isInitializing.value = true;
    try {
        if (typeof window === "undefined") {
            return;
        }

        const secure = window.isSecureContext || window.location.hostname === "localhost";
        isSupported.value = secure && "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

        if (!isSupported.value) {
            permission.value = "unsupported";
            debugLog("init push: unsupported in current context");
            return;
        }

        permission.value = Notification.permission as PushPermissionState;
        debugLog("init push: immediate permission check", { permission: permission.value });

        if (permission.value === "granted") {
            await syncCurrentSubscription();
            return;
        }

        window.setTimeout(async () => {
            permission.value = Notification.permission as PushPermissionState;
            debugLog("init push: delayed guide check", { permission: permission.value });
            if (permission.value === "denied") {
                try {
                    await unsubscribeCurrentClient();
                } catch (error) {
                    console.warn("Failed to unsubscribe push client after permission denied:", error);
                }
            } else {
                isSubscribed.value = false;
            }
        }, CHECK_DELAY_MS);
    } finally {
        isInitializing.value = false;
    }
};

const forceSyncCurrentSubscription = async () => {
    await syncCurrentSubscription({ force: true });
};

export const usePushSubscription = () => {
    return {
        permission,
        isSupported,
        isSubscribed,
        isSubscribing,
        showGuide,
        initPushSubscription,
        requestAndSubscribe,
        dismissGuide,
        unsubscribeCurrentClient,
        syncCurrentSubscription,
    };
};

export { forceSyncCurrentSubscription, unbindCurrentClientByDevice };
