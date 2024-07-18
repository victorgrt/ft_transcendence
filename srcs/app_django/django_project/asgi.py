# django_project/asgi.py

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import chat.routing
import game.routing
import notification.routing
import pages.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns + game.routing.websocket_urlpatterns + pages.routing.websocket_urlpatterns
            + notification.routing.websocket_urlpatterns
        )
    ),
})
