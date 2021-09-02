FROM nginx:1.20-alpine

ENV server_name localhost
ENV ovs_backend localhost:9090
ENV ui_support_backend localhost:9091

COPY dist/ui/* /usr/share/nginx/html/
COPY nginx.d/*.template /etc/nginx/templates/
