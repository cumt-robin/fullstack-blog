FROM node:18-slim AS base
RUN npm i -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm deploy --filter=vite-vue3 /app/vite-vue3
RUN pnpm deploy --filter=backend /app/backend

FROM base AS vite-vue3-build
COPY --from=build /app/vite-vue3 /usr/src/fullstack-blog/app/vite-vue3
COPY tsconfig.base.json /usr/src/fullstack-blog/tsconfig.base.json
WORKDIR /usr/src/fullstack-blog/app/vite-vue3
RUN pnpm build

FROM nginx:latest AS vite-vue3-frontend
COPY --from=vite-vue3-build /usr/src/fullstack-blog/app/vite-vue3/dist/ /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 80

FROM base AS webpack-vue3-build
COPY --from=build /app/webpack-vue3 /usr/src/fullstack-blog/app/webpack-vue3
COPY tsconfig.base.json /usr/src/fullstack-blog/tsconfig.base.json
WORKDIR /usr/src/fullstack-blog/app/webpack-vue3
RUN pnpm build

FROM nginx:latest AS webpack-vue3-frontend
COPY --from=webpack-vue3-build /usr/src/fullstack-blog/app/webpack-vue3/dist/ /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 80

FROM base AS backend
RUN npm i -g pm2-runtime
COPY --from=build /app/backend /usr/src/fullstack-blog/app/backend
WORKDIR /usr/src/fullstack-blog/app/backend
EXPOSE 8002
CMD ["pnpm", "start-docker-prod"]
