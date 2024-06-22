# 使用官方Node.js作为基础镜像
FROM node:16 as builder

# 设置工作目录
WORKDIR /app

# 首先复制项目的依赖配置文件
COPY package.json yarn.lock ./

# 安装项目依赖，这一步会生成一个独立的层，并且只有在package.json变化时才会重新执行
RUN yarn install

# 接着复制项目所有文件，这一步会生成一个新的层
COPY . .

# 构建项目，这一步也会生成一个新的层
RUN yarn build

# 使用Nginx镜像来运行构建好的项目
FROM nginx:latest

# 将构建好的项目复制到Nginx镜像的/usr/share/nginx/html目录下
COPY --from=builder /app/dist/ /usr/share/nginx/html

# 复制自定义的Nginx配置到镜像中，覆盖默认配置
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80