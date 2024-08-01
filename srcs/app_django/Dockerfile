FROM python:3

WORKDIR /usr/src/django-app

COPY ./ .

RUN mkdir -p /etc/ssl/certs /etc/ssl/private
COPY ../secrets/cert.pem /etc/ssl/certs/cert.pem
COPY ../secrets/key.pem /etc/ssl/private/key.pem

RUN chmod 600 /etc/ssl/private/key.pem \
	&& chmod 600 /etc/ssl/certs/cert.pem

RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x ./wait-for-it.sh

EXPOSE 8000

CMD ./wait-for-it.sh postgres:5432 -- bash -c " python manage.py makemigrations && python manage.py migrate && python runserver.py 0.0.0.0:8000 "