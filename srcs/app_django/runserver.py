import uvicorn
import os


ssl_keyfile_password = os.getenv('SSL_KEY_PASS', 'default_password')


if __name__ == "__main__":
	uvicorn.run("django_project.asgi:application", 
    			host="0.0.0.0", port=8000,
       			log_level="info",
          		ssl_certfile="/etc/ssl/certs/cert.pem",
            	ssl_keyfile="/etc/ssl/private/key.pem",
             	ssl_keyfile_password=ssl_keyfile_password)