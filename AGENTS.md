# AGENTS.md

Guidelines for coding agents working in the `fullstack-blog` monorepo.

## 1) Quick Start (Do This First)

```bash
# install
pnpm install

# run one target app/service
pnpm vite-vue3:dev
pnpm webpack-vue3:dev
pnpm vite-react19:dev
pnpm cra-react18:dev
pnpm nuxt3-web:dev
pnpm nest-server:dev
pnpm express-server:dev

# run fullstack (vite-vue3 + nest-server)
pnpm fullstack:dev
```

> **fullstack:dev prerequisite**: Requires MySQL. Use local MySQL or run via Docker (see [docker-ops.md](./docker-ops.md)).

For full run setup (Docker, non-container), environment variables (e.g. Sentry for vite-vue3), and CI variables, see [README.md](./README.md), [docker-ops.md](./docker-ops.md), and [legacy-ops.md](./legacy-ops.md).

## 2) Monorepo Layout

```text
fullstack-blog/
|- app/
|  |- vite-vue3
|  |- webpack-vue3
|  |- vite-react19
|  |- cra-react18
|  |- nuxt3-web
|  |- nest-server
|  `- express-server
`- packages/
   |- types
   |- services
   |- utils
   `- eslint-config
```

## 3) Source of Truth for Commands

Priority order:
1. Package-local `package.json` scripts
2. Root `package.json` scripts
3. This document examples

If this document conflicts with scripts, follow actual `package.json` scripts and update this file.

**Further reading**:
- Full run setup (Docker, non-container): [README.md](./README.md), [docker-ops.md](./docker-ops.md), [legacy-ops.md](./legacy-ops.md)
- Environment variables (e.g. Sentry for vite-vue3, CI secrets): see README and each app's `.env.example` if present

## 4) Common Commands

### Root scripts (available today)

```bash
# build (root shortcuts)
pnpm vite-vue3:build
pnpm webpack-vue3:build
pnpm vite-react19:build
pnpm cra-react18:build
pnpm nuxt3-web:build

# lint app packages only (./app/**)
pnpm lint
pnpm lint-fix

# selected tests exposed at root
pnpm vite-vue3:test
pnpm utils:test

# version/release
pnpm version-bump
pnpm release
```

### Filtered commands (recommended for precision)

```bash
# frontend
pnpm --filter vite-vue3 dev
pnpm --filter vite-vue3 test:e2e
pnpm --filter webpack-vue3 build
pnpm --filter vite-react19 lint
pnpm --filter cra-react18 test
pnpm --filter nuxt3-web dev

# backend
pnpm --filter nest-server dev
pnpm --filter nest-server build
pnpm --filter nest-server test
pnpm --filter nest-server test:e2e
pnpm --filter express-server dev

# shared packages
pnpm --filter @fullstack-blog/utils test
pnpm --filter @fullstack-blog/services lint
pnpm --filter @fullstack-blog/types lint
```

### TypeORM migrations (NestJS)

```bash
pnpm --filter nest-server migration:new
pnpm --filter nest-server migration:run
pnpm --filter nest-server migration:revert
```

## 5) Required Checks Before Commit

There is no universal root `pnpm test` script. Run checks based on changed scope:

- Changed only `app/vite-vue3/**`:
  - `pnpm --filter vite-vue3 lint`
  - `pnpm --filter vite-vue3 test:e2e` (if behavior/UI changed)
- Changed only `app/nest-server/**`:
  - `pnpm --filter nest-server lint`
  - `pnpm --filter nest-server test`
  - `pnpm --filter nest-server test:e2e` (if API contract changed)
- Changed only `packages/utils/**`:
  - `pnpm --filter @fullstack-blog/utils test`
- Changed multiple apps/packages:
  - Run each affected package's lint + tests
  - At minimum run `pnpm lint` for app-level linting

## 6) Coding Conventions

### TypeScript

- Strict mode is expected (including strict null checks)
- Prefer explicit function return types in public interfaces
- Use `interface` for object shapes, `type` for unions/primitives
- Keep imports grouped: external -> workspace packages -> relative

### Naming

- Components: PascalCase (`MyComponent.vue`, `MyButton/`)
- General files/services/utils: kebab-case (`article.service.ts`, `date-utils.ts`)
- Class-centric files may use PascalCase when matching exported class name (`ArticleService.ts`)
- Test files: `.spec.ts` (or existing project convention like `.test.ts`)

### Framework conventions

- Vue 3 apps: Composition API + `<script setup>`
- State:
  - `vite-vue3`: Pinia
  - `webpack-vue3`: Vuex
  - `vite-react19`: Zustand
  - `cra-react18`: Redux Toolkit
- NestJS: modular architecture (module/service/controller + DTO + entity)

### Error handling

- Frontend: user-friendly messages, no stack traces in UI
- Backend: framework-native exceptions with proper HTTP status
- Logging: `warn` for recoverable, `error` for critical failures

## 7) API/Service Layer Pattern

Use shared service/type packages for frontend API access. Keep service classes focused on endpoint mapping and typed responses.

```typescript
import { ApiService } from "@fullstack-blog/services";
import { ArticleDTO, PageResponse, QueryPageModel, RecordResponse } from "@fullstack-blog/types";

class ArticleService extends ApiService {
    public page(params: QueryPageModel) {
        return this.$get<PageResponse<ArticleDTO>>("page", params);
    }

    public detail(id: number) {
        return this.$get<RecordResponse<ArticleDTO>>("detail", { id });
    }
}
```

Checklist:
- Extend `ApiService` for each domain service (`article`, `category`, `tag`, etc.)
- Keep request/response types in `@fullstack-blog/types`
- Do not leak transport-layer details into UI components
- Keep endpoint strings and param shapes explicit

## 8) Testing Guidelines

- Unit/integration: Jest
- E2E: Playwright (`vite-vue3`)
- Prefer AAA pattern (Arrange, Act, Assert)
- Mock external dependencies and network I/O
- Add/adjust tests for behavior changes, not only for coverage numbers

## 9) Git and Release

- Conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`
- Use changesets workflow:
  - `pnpm version-bump`
  - `pnpm release`

## 10) Tech Stack Snapshot

- Frontend: Vue 3, React 18/19, Nuxt 3, Ant Design/Element Plus, Tailwind (React apps)
- Backend: NestJS + Express, TypeORM, MySQL2, JWT, class-validator, socket.io
- Tooling: pnpm workspace, ESLint, Prettier, Husky, Changesets, Playwright, Jest
- Observability: Sentry (vite-vue3)