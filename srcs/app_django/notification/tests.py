from django.test import TestCase
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"wss/notify/", consumers.NotificationConsumer.as_asgi()),
]