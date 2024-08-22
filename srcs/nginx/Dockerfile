FROM nginx:latest

RUN apt-get update && apt-get install -y openssl

RUN mkdir -p /etc/nginx/ssl
# COPY ./secrets/server/server-cert.pem /etc/nginx/ssl
# COPY ./secrets/server/server-key.pem  /etc/nginx/ssl
COPY nginx.conf /etc/nginx/nginx.conf

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=0.0.0.0/UID=lbouguet" \
    -keyout /etc/nginx/ssl/server-key.pem \
    -out /etc/nginx/ssl/server-cert.pem


CMD ["nginx", "-g", "daemon off;"]