#!/bin/bash

docker build . -f Dockerfile.dev --target vite-vue3-frontend --tag fullstack-blog-vite-vue3:dev
docker build . -f Dockerfile.dev --target backend --tag fullstack-blog-backend:dev

echo "build images successfully."
