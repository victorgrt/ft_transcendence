from django.urls import path
from .views import current_user_notifications
from .services.notification_services import send_notification_service

urlpatterns = [
    path('', send_notification_service, name='send_ta_mere'),
    path('/current_user_notifications', current_user_notifications, name='current_user_notifications')
]
