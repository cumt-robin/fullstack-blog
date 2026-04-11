# nuxt4-web (Nuxt 4)

Nuxt 4 app for blog UI with SSR-friendly data fetching. `vite-vue3` continues to use [`packages/services`](../../packages/services) (Axios + Bearer); this app uses an in-app `$fetch` client and does **not** import that package.

## Auth and cookies (SSR)

- **Backend** ([`nest-server`](../nest-server)): login sets an **HttpOnly** cookie (`blog_token`, see `AUTH_COOKIE_NAME` in `auth.constants.ts`). JWT is also returned in the JSON body for legacy clients. `AuthGuard` accepts **Bearer** header or cookie.
- **This app**: uses **same-origin** `public.apiBase` (default `/api`). Nitro proxies to `NUXT_API_TARGET` ([`server/api/[...path].ts`](server/api/[...path].ts)). The browser sends the auth cookie automatically; on **SSR**, the API client uses `useRequestFetch()` so the incoming request’s `Cookie` is forwarded to that internal `/api` hop.
- **Cross-origin**: if the Nuxt site and API are on different origins, you must align `SameSite`, `Secure`, and CORS/credentials; the default setup assumes one origin (or proxy) so cookies flow correctly.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3003`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
