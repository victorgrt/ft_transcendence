from django.shortcuts import render

# Create your views here.

from django.shortcuts import render
from .models import Notification

def current_user_notifications(request):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(to_user=request.user).order_by('-id')
    else:
        notifications = []
    return render(request, 'notifications.html', {'notifications': notifications})
