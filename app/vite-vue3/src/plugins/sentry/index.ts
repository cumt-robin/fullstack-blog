import type { Plugin } from "vue";
import * as Sentry from "@sentry/vue";

export const sentryPlugin: Plugin = {
    install: (app) => {
        Sentry.init({
            app,
            dsn: import.meta.env.VITE_APP_SENTRY_DSN,
            // Setting this option to true will send default PII data to Sentry.
            // For example, automatic IP address collection on events
            sendDefaultPii: true,
        });
    },
};
