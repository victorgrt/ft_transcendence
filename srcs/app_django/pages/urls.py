# pages/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path("", starting_page, name="home"),
    path("pong/", pong),
    path("register/", register),
    path("createUser", createUser),
    path("home_page/", home_page),
    path("chat/", chat)
]
