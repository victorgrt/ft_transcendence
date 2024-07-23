# Generated by Django 4.2.13 on 2024-07-19 13:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(max_length=150, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('avatar', models.ImageField(blank=True, null=True, upload_to='pages/static/pages/img_avatars')),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('register_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('last_login', models.DateTimeField(default=django.utils.timezone.now)),
                ('win', models.IntegerField(default=0)),
                ('lost', models.IntegerField(default=0)),
                ('nb_notifs', models.IntegerField(default=0)),
                ('friends', models.ManyToManyField(blank=True, related_name='friendships', to=settings.AUTH_USER_MODEL)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='customuser_groups', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='customuser_user_permissions', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_user_username', models.CharField(default='default_sender', max_length=150)),
                ('type_of_notification', models.CharField(max_length=100)),
                ('message', models.CharField(max_length=255)),
                ('read', models.BooleanField(default=False)),
                ('to_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_notifications', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
