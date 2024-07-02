#!/bin/bash

docker build . -f Dockerfile.dev --target frontend --tag fullstack-blog-frontend:dev
docker build . -f Dockerfile.dev --target backend --tag fullstack-blog-backend:dev

echo "build images succssfully."
