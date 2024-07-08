# pages/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path("", starting_page, name="home"),
	path("menuPong/", menuPong),
    path("pong/", pong),
	path("pongIA/", pongIA),
    path("register/", register),
    path("createUser", createUser),
    path("home_page/", home_page),
	path("login/", login),
	path('api/login_status/', get_login_status, name='login_status'),
]
