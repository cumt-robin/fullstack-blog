FROM node:18-slim AS base
RUN npm i -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm deploy --filter=vite-vue3 /app/vite-vue3
# RUN pnpm deploy --filter=webpack-vue3 /app/webpack-vue3
# RUN pnpm deploy --filter=webpack-vue3 /app/cra-react18
# RUN pnpm deploy --filter=express-server /app/express-server
RUN pnpm deploy --filter=nest-server /app/nest-server

FROM base AS vite-vue3-build
COPY --from=build /app/vite-vue3 /usr/src/fullstack-blog/app/vite-vue3
COPY tsconfig.base.json /usr/src/fullstack-blog/tsconfig.base.json
WORKDIR /usr/src/fullstack-blog/app/vite-vue3
RUN pnpm build

FROM nginx:latest AS vite-vue3-frontend
COPY --from=vite-vue3-build /usr/src/fullstack-blog/app/vite-vue3/dist/ /usr/share/nginx/html
EXPOSE 80

# FROM base AS webpack-vue3-build
# COPY --from=build /app/webpack-vue3 /usr/src/fullstack-blog/app/webpack-vue3
# COPY tsconfig.base.json /usr/src/fullstack-blog/tsconfig.base.json
# WORKDIR /usr/src/fullstack-blog/app/webpack-vue3
# RUN pnpm build

# FROM nginx:latest AS webpack-vue3-frontend
# COPY --from=webpack-vue3-build /usr/src/fullstack-blog/app/webpack-vue3/dist/ /usr/share/nginx/html
# EXPOSE 80

# FROM base AS express-backend
# RUN npm i -g pm2-runtime
# COPY --from=build /app/express-server /usr/src/fullstack-blog/app/express-server

FROM base AS nest-server-build
COPY --from=build /app/nest-server /usr/src/fullstack-blog/app/nest-server
WORKDIR /usr/src/fullstack-blog/app/nest-server
RUN pnpm build

FROM base AS nestjs-backend
RUN npm i -g pm2-runtime
COPY --from=nest-server-build /usr/src/fullstack-blog/app/nest-server/dist /usr/src/fullstack-blog/app/nest-server/dist
COPY --from=nest-server-build /usr/src/fullstack-blog/app/nest-server/node_modules /usr/src/fullstack-blog/app/nest-server/node_modules
COPY --from=nest-server-build /usr/src/fullstack-blog/app/nest-server/package.json /usr/src/fullstack-blog/app/nest-server/package.json
COPY --from=nest-server-build /usr/src/fullstack-blog/app/nest-server/process-docker-prod.json /usr/src/fullstack-blog/app/nest-server/process-docker-prod.json
