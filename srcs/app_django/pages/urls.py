# pages/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path("", starting_page, name="home"),
    path("pong/", pong),
	path("menuPong/", menuPong),
    path("register/", register),
    path("createUser", createUser),
    path("home_page/", home_page),
    path("chat/", chat),
	path("login/", login),
	path('api/login_status/', get_login_status, name='login_status'),
]
