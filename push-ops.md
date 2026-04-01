# Push Subscription Ops (vite-vue3 + nest-server)

## 1. Generate VAPID keys

```bash
pnpm --filter nest-server webpush:keys
```

The command prints:
- `publicKey`
- `privateKey`

## 2. Configure env

Nest (`app/nest-server/.env.development.local`):

```env
WEB_PUSH_VAPID_PUBLIC_KEY=your_public_key
WEB_PUSH_VAPID_PRIVATE_KEY=your_private_key
WEB_PUSH_CONTACT_EMAIL=you@example.com
```

Vite (`app/vite-vue3/.env.local`):

```env
VITE_APP_WEB_PUSH_PUBLIC_KEY=your_public_key
```

## 3. Run apps

```bash
pnpm fullstack:dev
```

## 4. Local verification flow

1. Open homepage and wait a few seconds.
2. Confirm top guide appears for unsubscribed client.
3. Click "开启通知", allow browser permission.
4. Publish a new article from backend write page.
5. Check notification content:
   - new article: `eventType = article_created`
   - edited article: `eventType = article_updated`
6. Click notification and verify article detail opens/focuses.
7. Logout and verify subscription is unbound from user (anonymous retention).
8. Click "关闭通知" on homepage and verify no further notifications.

## 5. API summary

- `POST /push-subscription/subscribe`
- `POST /push-subscription/unsubscribe`
- `POST /push-subscription/unbind_user`
- `GET /push-subscription/admin_page`

