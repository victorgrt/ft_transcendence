#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')
    try:
        from django.core.management import execute_from_command_line
        from channels.routing import ProtocolTypeRouter
        from django.core.asgi import get_asgi_application
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    django_asgi_app = get_asgi_application()
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ChatApp.settings")
    application = ProtocolTypeRouter({
    "http": django_asgi_app})
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()

ASGI_APPLICATION = 'ChatApp.asgi.application'
