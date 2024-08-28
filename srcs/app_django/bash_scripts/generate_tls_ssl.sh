#!/bin/bash

# Clean up old files
rm -f *../.pem
rm -rf ../secrets/*

# Create directories first
mkdir -p ../secrets/ca ../secrets/server

# 1. Generate CA's private key and self-signed certificate
openssl req -x509 -newkey rsa:4096 -days 365 -nodes -keyout ca-key.pem -out ca-cert.pem -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=Student/CN=localhost/emailAddress=trantran@42.fr"
if [ $? -ne 0 ]; then
    echo "Failed to generate CA's certificate and private key"
    exit 1
fi

echo "CA's self-signed certificate"
openssl x509 -in ca-cert.pem -noout -text

# 2. Generate web server's private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 -keyout server-key.pem -out server-req.pem -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=Student/CN=localhost/emailAddress=trantran@42.fr"
if [ $? -ne 0 ]; then
    echo "Failed to generate server's private key and CSR"
    exit 1
fi

# 3. Create the 'server-ext.cnf' file for certificate extensions
cat > server-ext.cnf << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = localhost
EOF

# 4. Use CA's private key to sign web server's CSR and get back the signed certificate
openssl x509 -req -in server-req.pem -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -days 60 -extfile server-ext.cnf
if [ $? -ne 0 ]; then
    echo "Failed to sign server's CSR"
    exit 1
fi

echo "Server's signed certificate"
openssl x509 -in server-cert.pem -noout -text

echo "Command to verify Server and CA certificates"
openssl verify -CAfile ca-cert.pem server-cert.pem
if [ $? -ne 0 ]; then
    echo "Failed to verify server's certificate"
    exit 1
fi

# 5. Move files
mv server-key.pem ../secrets/server/
mv server-cert.pem ../secrets/server/
mv server-req.pem ../secrets/server/
mv ca-cert.pem ../secrets/ca/
mv ca-key.pem ../secrets/ca/
mv server-ext.cnf ../secrets/server/

echo "All files moved to the secrets directory"


# 6. Permissions
chmod 777 ../secrets/server/server-key.pem
chmod 777 ../secrets/server/server-cert.pem