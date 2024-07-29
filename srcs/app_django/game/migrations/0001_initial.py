# Generated by Django 4.2.13 on 2024-07-28 16:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="GameSession",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("player1", models.CharField(blank=True, max_length=100, null=True)),
                ("player2", models.CharField(blank=True, max_length=100, null=True)),
                ("session_id", models.CharField(max_length=100, unique=True)),
                (
                    "tournament_id",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                ("state", models.TextField(default="{}")),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name="Tournament",
            fields=[
                (
                    "id",
                    models.CharField(
                        max_length=100, primary_key=True, serialize=False, unique=True
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("start_date", models.DateTimeField(default=django.utils.timezone.now)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("state", models.TextField(default="waiting")),
                (
                    "final_game",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="final_game",
                        to="game.gamesession",
                    ),
                ),
                (
                    "players",
                    models.ManyToManyField(
                        related_name="tournaments_played", to=settings.AUTH_USER_MODEL
                    ),
                ),
                (
                    "semi_final_games",
                    models.ManyToManyField(
                        related_name="semi_final_games", to="game.gamesession"
                    ),
                ),
                (
                    "small_final_game",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="small_final_game",
                        to="game.gamesession",
                    ),
                ),
                (
                    "winner",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tournaments_won",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="MatchHistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("player_1_score", models.IntegerField(null=True)),
                ("player_2_score", models.IntegerField(null=True)),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "game",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="matches",
                        to="game.gamesession",
                    ),
                ),
                (
                    "player_1",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="matches_as_player_1",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "player_2",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="matches_as_player_2",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "winner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="won_matches",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
