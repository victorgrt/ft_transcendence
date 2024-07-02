#bin/bash

source ../app_django/django_project/.env



#sudo service postgresql start
echo "CREATE USER ${DB_ACC_ADMIN} WITH PASSWORD '${DB_ACC_PSWD}';"
sudo -u postgres psql -c "CREATE DATABASE \"${DB_ACC_NAME}\";" 
sudo -u postgres psql -c "CREATE USER ${DB_ACC_ADMIN} WITH PASSWORD '${DB_ACC_PSWD}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"${DB_ACC_NAME}\" TO ${DB_ACC_ADMIN};"