from django.urls import path
from .consumers import NotificationConsumer

websocket_urlpatterns = [
    path('wss/notifications/$', NotificationConsumer.as_asgi()),
]