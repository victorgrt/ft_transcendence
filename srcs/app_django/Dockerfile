FROM python:3

WORKDIR /usr/src/django-app

COPY ./ .

# RUN mkdir -p /etc/ssl/certs /etc/ssl/private
# COPY ./secrets/server/server-cert.pem /etc/ssl/certs/cert.pem
# COPY ./secrets/server/server-key.pem /etc/ssl/private/key.pem

# RUN chmod 600 /etc/ssl/private/key.pem \
# 	&& chmod 600 /etc/ssl/certs/cert.pem

RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x ./bash_scripts/wait-for-it.sh

EXPOSE 8000

CMD ./bash_scripts/wait-for-it.sh postgres:5432 -- bash -c "python manage.py makemigrations && python manage.py migrate && python runserver.py"