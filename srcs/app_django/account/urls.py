from django.contrib import admin
from django.urls import path, include
from .views import *

app_name = 'account'

urlpatterns = [
#   path("register/", register, name='register'),
  path("settings/", settings, name='settings'),
  path("createUser", createUser),
  path("login/", login),
  path('api/login_status/', get_login_status, name='login_status'),
#   path("account/", account),
  path("logout/", logout),
  path("user_avatar/", user_avatar, name='user_avatar'),
  path("search_friend/", user_avatar, name='user_avatar'),
  path("accept_friend_request/<int:userID>/", accept_friend_request, name='accept_friend_request'),
  path("send_friend_request/", send_friend_request, name='send_friend_request'),
]