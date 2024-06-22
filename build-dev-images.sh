#!/bin/bash

docker build . -f Dockerfile.dev --target frontend --tag fullstack-blog-frontend:latest
docker build . -f Dockerfile.dev --target backend --tag fullstack-blog-backend:latest

echo "build images succssfully."