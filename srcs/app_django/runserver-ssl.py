import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "django_project.asgi:application",
        host="0.0.0.0",
        port=8001,
        log_level="info",
        ssl_keyfile="/etc/ssl-nginx/server-key.pem",
        ssl_certfile="/etc/ssl-nginx/server-cert.pem"
    )