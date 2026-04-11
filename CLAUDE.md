# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

For detailed coding conventions, API patterns, and testing guidelines, see [AGENTS.md](./AGENTS.md).

## Essential Commands

```bash
pnpm install                              # Install all dependencies

# Development
pnpm fullstack:dev                        # Run vite-vue3 + nest-server together (requires MySQL)
pnpm vite-vue3:dev                        # Frontend only (Vue 3 + Vite)
pnpm nest-server:dev                      # Backend only (NestJS)

# Build
pnpm vite-vue3:build                      # Build main frontend
pnpm --filter nest-server build           # Build backend

# Lint
pnpm lint                                 # Lint all app packages
pnpm lint-fix                             # Auto-fix lint issues
pnpm --filter <package> lint              # Lint specific package

# Test
pnpm --filter vite-vue3 test:e2e          # Playwright E2E tests
pnpm --filter nest-server test            # NestJS unit tests
pnpm --filter @fullstack-blog/utils test  # Utils unit tests

# Run a single test file
pnpm --filter nest-server test -- --testPathPattern=<pattern>
pnpm --filter @fullstack-blog/utils test -- --testPathPattern=<pattern>

# TypeORM migrations
pnpm --filter nest-server migration:new   # Create migration
pnpm --filter nest-server migration:run   # Run migrations
pnpm --filter nest-server migration:revert

# Versioning
pnpm changeset                            # Create changeset entry
pnpm version-bump                         # Bump versions
pnpm release                              # Tag and push
```

## Architecture

This is a **pnpm monorepo** (pnpm 9.4.0, Node >=20.19.0) with multiple frontend implementations sharing one backend.

### Apps (`app/`)

| App | Stack | Status |
|-----|-------|--------|
| `vite-vue3` | Vue 3 + Vite 8 + Pinia + Ant Design Vue + PWA | Primary frontend |
| `nest-server` | NestJS + TypeORM + MySQL + JWT + Socket.io | Primary backend |
| `vite-react19` | React 19 + Zustand + Ant Design + Tailwind | Active |
| `webpack-vue3` | Vue 3 + Webpack + Vuex + SCSS | Alternative |
| `cra-react18` | React 18 + Redux Toolkit + Tailwind | Alternative |
| `nuxt4-web` | Nuxt 4 | Experimental |
| `express-server` | Express | Legacy, not maintained |

### Shared Packages (`packages/`)

- `@fullstack-blog/types` — Shared TypeScript interfaces and DTOs used by both frontend and backend
- `@fullstack-blog/services` — Axios-based API service layer (frontends extend `ApiService` per domain)
- `@fullstack-blog/utils` — Utility functions (Jest tested)
- `@fullstack-blog/eslint-config` — Shared ESLint rules (Airbnb base + Prettier)

### Data Flow

Frontend apps import from `@fullstack-blog/services` and `@fullstack-blog/types` to call the NestJS backend. The service layer pattern: each domain (article, category, tag, etc.) has a service class extending `ApiService` with typed request/response methods. Keep types in the `types` package, not in individual apps.

### Backend Structure (nest-server)

Standard NestJS modular architecture: `module → controller → service → entity`. Uses TypeORM with MySQL, JWT for auth, class-validator for DTO validation, and Socket.io for real-time features. Migrations live in `app/nest-server/src/migrations/`.

## Formatting

- Prettier: 4-space indent, 140 char width, LF line endings, no trailing commas
- Conventional commits enforced via commitlint + husky (`feat:`, `fix:`, `docs:`, etc.)
- Interactive commit available via `git cz`

## Pre-commit Checks

No universal `pnpm test`. Run checks scoped to what you changed:
- Frontend changes: `pnpm --filter <app> lint` (+ E2E if behavior changed)
- Backend changes: `pnpm --filter nest-server lint` + `pnpm --filter nest-server test`
- Shared package changes: run that package's tests + lint for all consuming apps

## Docker

`fullstack:dev` requires MySQL. For local dev without a standalone MySQL install, use `compose-dev.yml`. Production deployment uses `compose.yml` with multi-stage Docker builds. See [docker-ops.md](./docker-ops.md).
