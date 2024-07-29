from django.contrib import admin
from django.urls import path, include
from .views import *

app_name = 'friends'

urlpatterns = [
    path('is_friend/', is_friend, name="is_friend"),
	path('send_friend_request/', send_friend_request, name="send_friend_request"),
	path('accept_friend_request/', accept_friend_request, name="accept_friend_request"),
]