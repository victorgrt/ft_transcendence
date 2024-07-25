from django.urls import path
from . import views
from .services.notification_services import send_notification_service

urlpatterns = [
    path('', send_notification_service, name='send_notification_service')
]