from django.urls import path
from . import consumers
from .tournamentConsumers import TournamentConsumer

websocket_urlpatterns = [
    path('ws/pong/<str:game_id>/', consumers.PongConsumer.as_asgi()),
    path('ws/tournament/<str:game_id>/', TournamentConsumer.as_asgi()),
]
