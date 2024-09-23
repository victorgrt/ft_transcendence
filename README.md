# ft_transcendence

Commandes utiles :

run server: python3 runserver.py
create superuser: python3 manage.py createsuperuser --username=joe --email=joe@example.com
Migration:
    python3 manage.py makemigrations
    python3 manage.py showmigrations
    python3 manage.py migrate

Access sqlite3 db via django shell:
	python manage.py shell
	from page.models import CustomUser
	users = CustomUser.objects.all()
	for user in users:
    	print(user.username, user.email)
Delete all users: CustomUser.objects.all().delete()

Create a new app:
	python manage.py startapp myapp


