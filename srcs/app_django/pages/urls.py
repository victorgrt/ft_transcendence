# pages/urls.py
from django.urls import path
from .views import *

urlpatterns = [
  # navigation
  path("", scene, name="home"),
  path("home_page/", home_page),
  path("menuPong/", menuPong),

  # account
  path("register/", register),
  path("createUser", createUser),
  path("login/", login),
  path('api/login_status/', get_login_status, name='login_status'),
  path("account/", account),

  # Game
  path('create_session/', create_session, name='create_session'),
  path('join_session/<str:session_id>/', join_session, name='join_session'),
  path("pong/<str:session_id>/", pong, name="pong_session"),  # Add this line
]
