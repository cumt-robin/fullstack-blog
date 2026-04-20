self.addEventListener("push", (event) => {
    let payload = {
        title: "新消息通知",
        body: "您有一条新的消息",
        url: "/",
        icon: "/pwa-192x192.png",
        tag: "default",
    };

    if (event.data) {
        try {
            const parsed = event.data.json();
            payload = {
                ...payload,
                ...parsed,
            };
        } catch (_error) {
            const text = event.data.text?.();
            if (text) {
                payload.body = text;
            }
        }
    }

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon,
            tag: payload.tag,
            data: {
                url: payload.url,
            },
        }),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && "focus" in client) {
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
            return Promise.resolve();
        }),
    );
});
