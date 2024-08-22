import uvicorn
import os

cert_file = "./secrets/server/server-cert.pem"
key_file = "./secrets/server/server-key.pem"
ssl_keyfile_password = "pswpsw"  # Replace with your actual password if applicable

# Print file paths to confirm they are correct
print(f"SSL Certfile: {cert_file}")
print(f"SSL Keyfile: {key_file}")

# Check if files exist
if not os.path.isfile(cert_file):
    raise FileNotFoundError(f"Certificate file not found: {cert_file}")
if not os.path.isfile(key_file):
    raise FileNotFoundError(f"Key file not found: {key_file}")

# Start the Uvicorn server with SSL/TLS
if __name__ == "__main__":
    uvicorn.run(
        "django_project.asgi:application",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        ssl_certfile=cert_file,
        ssl_keyfile=key_file,
        ssl_keyfile_password=ssl_keyfile_password  # Include this line only if your private key is protected by a passphrase
    )
