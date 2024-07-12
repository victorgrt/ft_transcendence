from django.db import models
from django.conf import settings

# Create your models here.

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
    date = models.DateTimeField(auto_now_add=True)
	
