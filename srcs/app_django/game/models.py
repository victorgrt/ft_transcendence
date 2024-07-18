from django.conf import settings
from django.db import models
from django.utils import timezone

class MatchHistory(models.Model):
    winner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='match_wins',
        on_delete=models.CASCADE
    )
    loser = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='match_losses',
        on_delete=models.CASCADE
    )
    game = models.ForeignKey(
        'GameSession',
        related_name='matches',
        on_delete=models.CASCADE
    )
    player_1_score = models.IntegerField()
    player_2_score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)