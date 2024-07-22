from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# Create your models here.

class GameSession(models.Model):
    player1 = models.CharField(max_length=100, null=True, blank=True)
    player2 = models.CharField(max_length=100, null=True, blank=True)
    session_id = models.CharField(max_length=100, unique=True)
    state = models.TextField(default='{}')
    created_at = models.DateTimeField(default=timezone.now)

class MatchHistory(models.Model):
    winner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='won_matches',
        on_delete=models.CASCADE
    )
    loser = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='lost_matches',
        on_delete=models.CASCADE
    )    
    game = models.ForeignKey(
        'GameSession',
        related_name='matches',
        on_delete=models.CASCADE,
        null=True,
    )
    player_1_score = models.IntegerField(null=True)
    player_2_score = models.IntegerField(null=True)
    date = models.DateTimeField(auto_now_add=True)
	
