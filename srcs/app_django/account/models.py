from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission
from django.contrib.auth.models import BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone
# from django.core.files.storage import FileSystemStorage

# Create your models here.
class FriendRequest(models.Model):
	from_user = models.ForeignKey("CustomUser", on_delete=models.CASCADE, related_name="from_user")
	to_user = models.ForeignKey("CustomUser", on_delete=models.CASCADE, related_name="to_user")


class Notification(models.Model):
    to_user = models.ForeignKey('CustomUser', related_name='received_notifications', on_delete=models.CASCADE)
    from_user = models.ForeignKey('CustomUser', related_name='sent_notifications', on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=timezone.now)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f'From {self.from_user.username} to {self.to_user.username}: {self.message}'
    
class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, avatar=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        if not password:
            raise ValueError('The Password field must be set')

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, avatar=avatar, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        return self.create_user(username=username, email=email, password=password, **extra_fields)

# avatar_storage = FileSystemStorage(location='pages/static/pages/img_avatars') #a verifier
class CustomUser(AbstractBaseUser, PermissionsMixin):
	username = models.CharField(max_length=150, unique=True)
	email = models.EmailField(unique=True)
	avatar = models.ImageField(upload_to='pages/static/pages/img_avatars', blank=True, null=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)  # Add this field
	register_date = models.DateTimeField(default=timezone.now)
	last_login = models.DateTimeField(default=timezone.now)
	friends = models.ManyToManyField("CustomUser", blank=True, related_name="friendships")
	win = models.IntegerField(default=0)
	lost = models.IntegerField(default=0)
  

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	groups = models.ManyToManyField(
	    Group,
	    related_name='customuser_groups',
	    blank=True,
	    help_text=('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
	    verbose_name=('groups'),
	)
	user_permissions = models.ManyToManyField(
	    Permission,
	    related_name='customuser_user_permissions',
	    blank=True,
	    help_text=('Specific permissions for this user.'),
	    verbose_name=('user permissions'),
	)
	objects = UserManager()
	def __str__(self):
		return self.email

	def get_avatar_name(self):
		if self.avatar:
			name_split = self.avatar.name.split("/")
			name_plit_len = len(name_split)
			only_jpeg = name_split[name_plit_len - 1] 
			print(name_split[name_plit_len - 1])
			print("here", name_split[name_plit_len - 1])
			return only_jpeg
		return None