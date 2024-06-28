from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
#dep: pip install Pillow (for loading images in db)
 
#Creating Account table
# class AccTable(models.Model):
#     #id = models.IntegerField() AutoField key
#     name = models.CharField(max_length=150)
#     password = models.CharField(max_length=150)
#     email = models.CharField(max_length=150)
#     avatar = models.ImageField(upload_to='img_avatars/')
#     def __str__(self):
#         return self.name

class UserManager(BaseUserManager):
    def create_user(self, name, email, password=None, avatar=None):
        if not email:
            raise ValueError('The Email field must be set')        
        if not name:
            raise ValueError('The Name field must be set')
        if not password:
            raise ValueError('The Password field must be set')
        email = self.normalize_email(email)
        user = self.model(name=name, email=email, avatar=avatar)
        #password hasshing
        user.set_password(password)
        #saving to database DATABASES
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # Implement logic to create a superuser
        extra_fields.setdefault('is_superuser', True)
        
        # Call create_user method to create the user
        return self.create_user(email=email, password=password, **extra_fields)

class CustomUser(AbstractBaseUser):
    #models. is a module that defines field's type by providing various classes.
    #name is a CharField object instance
    name = models.CharField(max_length=150)
    password = models.CharField(max_length=150)
    email = models.CharField(max_length=150)
    register_date = models.DateTimeField(default=timezone.now)
    avatar = models.ImageField(upload_to='img_avatars/')
    is_active =  models.BooleanField(default=True)
    last_login =  models.DateTimeField(default=timezone.now)
    is_superuser = models.BooleanField(default=False)

    #authentification and login purposes
    USERNAME_FIELD = 'email'
    #forces name, psw, and email fields to be defined by superuser
    #REQUIRED_FIELDS = ['name']

    #the manager is typically accessed through the objects attribute of the model class (convention)
    objects = UserManager()

    def __str__(self):
        return self.email