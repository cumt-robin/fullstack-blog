FROM node:18-slim AS base
RUN npm i -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm deploy --filter=vite-vue3 /app/frontend
RUN pnpm deploy --filter=backend /app/backend

FROM base AS frontend-build
COPY --from=build /app/frontend /usr/src/fullstack-blog/app/frontend
COPY tsconfig.base.json /usr/src/fullstack-blog/tsconfig.base.json
WORKDIR /usr/src/fullstack-blog/app/frontend
RUN pnpm build

FROM nginx:latest AS frontend
COPY --from=frontend-build /usr/src/fullstack-blog/app/frontend/dist/ /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 80

FROM base AS backend
COPY --from=build /app/backend /usr/src/fullstack-blog/app/backend
WORKDIR /usr/src/fullstack-blog/app/backend
USER node
EXPOSE 8002
CMD ["node", "src/app.js"]
