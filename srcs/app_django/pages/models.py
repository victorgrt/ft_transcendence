from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission
from django.contrib.auth.models import BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone


class GameSession(models.Model):
    player1 = models.CharField(max_length=100, null=True, blank=True)
    player2 = models.CharField(max_length=100, null=True, blank=True)
    session_id = models.CharField(max_length=100, unique=True)
    state = models.TextField(default='{}')
    created_at = models.DateTimeField(default=timezone.now)


