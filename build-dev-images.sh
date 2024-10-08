#!/bin/bash

# docker build . -f Dockerfile.dev --target vite-vue3-frontend --tag fullstack-blog-vite-vue3:dev
docker build . -f Dockerfile.dev --target cra-react18-frontend --tag fullstack-blog-cra-react18:dev
docker build . -f Dockerfile.dev --target express-backend --tag fullstack-blog-express:dev

echo "build images successfully."
