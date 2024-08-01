from django.urls import path
from . import consumers
from .tournamentConsumers import TournamentConsumer

websocket_urlpatterns = [
    path('wss/pong/<str:game_id>/<str:mode>/', consumers.PongConsumer.as_asgi()),
    path('wss/tournament/<str:game_id>/', TournamentConsumer.as_asgi()),
]
