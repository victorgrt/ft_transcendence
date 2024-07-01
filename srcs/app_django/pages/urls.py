# pages/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path("", starting_page, name="home"),
    path("pong/", pong),
    path("acount/", account),
    path("home_page/", home_page)
]
