# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in the fullstack-blog repository.

## Project Overview

This is a full-stack blog monorepo built with:
- Frontend: Vue 3 (Vite), React 18/19, Nuxt 3
- Backend: NestJS, Express.js
- Database: MySQL with TypeORM
- Package Manager: pnpm (monorepo architecture)
- Language: TypeScript (strict mode)

## Development Commands

### Root Level Commands
```bash
# Install dependencies
pnpm install

# Run specific app in development mode
pnpm vite-vue3:dev
pnpm vite-react19:dev
pnpm cra-react18:dev
pnpm nuxt3-web:dev
pnpm nest-server:dev
pnpm express-server:dev

# Run full-stack development (Vue3 frontend + NestJS backend)
pnpm fullstack:dev

# Build specific apps
pnpm vite-vue3:build
pnpm nest-server:build
# etc.

# Linting
pnpm lint          # Run linting on all apps
pnpm lint-fix      # Fix linting issues
```

### App-Specific Commands

#### Frontend Apps (Vue/React)
```bash
# Example: vite-vue3
pnpm --filter vite-vue3 dev          # Development server
pnpm --filter vite-vue3 build         # Production build
pnpm --filter vite-vue3 preview       # Preview production build
pnpm --filter vite-vue3 lint          # ESLint
pnpm --filter vite-vue3 lint-fix      # Auto-fix ESLint
pnpm --filter vite-vue3 lint-style    # Stylelint
pnpm --filter vite-vue3 lint-style-fix # Auto-fix Stylelint
```

#### Backend Apps (NestJS)
```bash
# Example: nest-server
pnpm --filter nest-server dev          # Development with watch
pnpm --filter nest-server build        # Production build
pnpm --filter nest-server start        # Production start
pnpm --filter nest-server lint         # ESLint
pnpm --filter nest-server test         # Run all tests
pnpm --filter nest-server test:watch   # Watch mode testing
pnpm --filter nest-server test:cov     # Coverage report
pnpm --filter nest-server test:e2e     # End-to-end tests

# Single test file
pnpm --filter nest-server test -- article.service.spec.ts
```

## Code Style Guidelines

### General TypeScript Rules
- Use strict TypeScript with enabled strict null checks
- Prefer explicit return types for functions
- Use interfaces for object shapes, types for unions/primitives
- Import interfaces and types separately: `import { Type, Interface } from './module'`

### ESLint Configuration
Based on Airbnb config with customizations:
- Console allowed only for `warn` and `error`
- No plusplus restrictions lifted
- CamelCase rules disabled for flexibility
- Prefer default exports disabled (named exports preferred)
- Extensions in imports disabled

### Prettier Configuration
```json
{
  "tabs": false,
  "tabWidth": 4,
  "endOfLine": "lf",
  "printWidth": 140
}
```

### File Naming Conventions
- Components: PascalCase (`MyComponent.vue`, `MyButton/`)
- Services/Utils: kebab-case (`article.service.ts`, `date-utils.ts`)
- Files with single export: match export name (`ArticleService.ts`)
- Test files: `.spec.ts` suffix (`article.service.spec.ts`)

### Import Organization
```typescript
// 1. External libraries
import { createApp } from "vue";
import axios from "axios";

// 2. Internal services/modules
import { ApiService } from "@/services/index";
import { ArticleDTO } from "@/bean/dto";

// 3. Relative imports
import { helper } from "./utils";
```

### Vue 3 Specific Guidelines
- Use Composition API with `<script setup>`
- Pinia for state management
- Vue Router 4 for routing
- Use TypeScript with proper component props typing
- Components should be in `components/` directory with index.vue
- Views in `views/` directory organized by feature

### NestJS Specific Guidelines
- Use modular architecture (modules for each feature)
- Services for business logic, controllers for HTTP handling
- DTOs for data transfer (validation with class-validator)
- Entities for database models (TypeORM)
- Dependency injection pattern throughout
- Proper error handling with NestJS built-in exceptions

### Testing Guidelines
- Use Jest for unit/integration tests
- Test files should be alongside source files with `.spec.ts` suffix
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies
- Aim for meaningful test coverage, not just coverage percentage

### API/Service Layer Pattern
```typescript
class ArticleService extends ApiService {
    public page(params: QueryPageModel) {
        return this.$get<PageResponse<ArticleDTO>>("page", params);
    }
    
    public detail(id: number) {
        return this.$get<RecordResponse<ArticleDTO>>("detail", { id });
    }
}
```

### Error Handling
- Frontend: Use try-catch with user-friendly error messages
- Backend: Use NestJS built-in exceptions with proper HTTP status codes
- Log errors appropriately (warn for recoverable, error for critical)
- Never expose stack traces to end users

### Git Commit Messages
Follow conventional commits:
- `feat:` for new features
- `fix:` for bug fixes  
- `docs:` for documentation
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding/updating tests

## Development Workflow

1. Always run `pnpm lint` and `pnpm test` before committing
2. Pre-commit hooks will run lint-staged automatically
3. Use changesets for version management and changelog generation
4. Test changes in relevant environments before merging

## Technology Stack Details

### Frontend Libraries
- Vue 3.4+ with Composition API
- Ant Design Vue / Element Plus for UI components
- Axios for HTTP requests
- Pinia for state management
- Vue Router for navigation
- Day.js for date handling
- Marked for markdown processing

### Backend Libraries
- NestJS 10+ with Express
- TypeORM for database ORM
- MySQL2 for MySQL connection
- JWT for authentication
- Class-validator for DTO validation
- Socket.io for real-time features

### Development Tools
- Vite for frontend bundling
- ESLint + Prettier for code quality
- Jest for testing
- Husky for git hooks
- Changesets for versioning