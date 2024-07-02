#bin/bash

source ../app_django/django_project/.env

echo "Dropping user ${DB_ACC_ADMIN} and database ${DB_ACC_NAME}."

sudo -u postgres psql -c "REVOKE ALL PRIVILEGES ON DATABASE \"${DB_ACC_NAME}\" FROM ${DB_ACC_ADMIN};"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS \"${DB_ACC_NAME}\";"
sudo -u postgres psql -c "DROP USER IF EXISTS ${DB_ACC_ADMIN};"
