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
    tournament_id = models.CharField(max_length=100, null=True, blank=True)
    state = models.TextField(default='{}')
    created_at = models.DateTimeField(default=timezone.now)

class MatchHistory(models.Model):
    player_1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='matches_as_player_1',
        on_delete=models.CASCADE
    )
    player_2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='matches_as_player_2',
        on_delete=models.CASCADE
    )    
    winner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='won_matches',
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
	
class Tournament(models.Model):
    id = models.CharField(max_length=100, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField(default=timezone.now)
    semi_final_games = models.ManyToManyField('GameSession', related_name='semi_final_games')
    final_game = models.ForeignKey('GameSession', related_name='final_game', on_delete=models.CASCADE, null=True)
    small_final_game = models.ForeignKey('GameSession', related_name='small_final_game', on_delete=models.CASCADE, null=True)
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tournaments_won', on_delete=models.CASCADE, null=True)
    players = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='tournaments_played')
    created_at = models.DateTimeField(default=timezone.now)
    state = models.TextField(default='waiting')


class TournamentRanking(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='rankings')
    player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tournament_rankings')
    rank = models.IntegerField()

    class Meta:
        unique_together = ('tournament', 'player')
        ordering = ['rank']

    def __str__(self):
        return f"{self.tournament.name} - {self.player.username}: Rank {self.rank}"