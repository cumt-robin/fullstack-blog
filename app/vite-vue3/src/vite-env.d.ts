/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";

    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module "virtual:pwa-register/vue" {
    import type { Ref } from "vue";

    export interface RegisterSWOptions {
        immediate?: boolean;
        onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
        onRegisterError?: (error: unknown) => void;
    }

    export interface RegisterSWReturn {
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
        offlineReady: Ref<boolean>;
        needRefresh: Ref<boolean>;
    }

    export function useRegisterSW(options?: RegisterSWOptions): RegisterSWReturn;
}

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_BASE_API: string;
    readonly VITE_APP_SOCKET_SERVER: string;
    readonly VITE_APP_SENTRY_DSN: string;
    readonly VITE_APP_WEB_PUSH_PUBLIC_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
