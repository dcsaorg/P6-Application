FROM node:alpine as build-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build -- --configuration production --aot

FROM nginx:1.20-alpine

ENV server_name localhost
ENV jit_backend http://127.0.0.1:9090/v1
ENV ui_support_backend http://127.0.0.1:9091/v1

COPY --from=build-deps /usr/src/app/dist/ui/*.* /usr/share/nginx/html/
COPY --from=build-deps /usr/src/app/dist/ui/assets /usr/share/nginx/html/assets
COPY nginx.d/*.template /etc/nginx/templates/
