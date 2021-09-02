FROM nginx:1.20-alpine

ENV server_name localhost
ENV ovs_backend http://127.0.0.1:9090/v2
ENV ui_support_backend http://127.0.0.1:9091/v1

COPY dist/ui/* /usr/share/nginx/html/
COPY nginx.d/*.template /etc/nginx/templates/
