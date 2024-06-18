# pages/urls.py
from django.urls import path

from .views import starting_page
from .views import game
from .views import acount

urlpatterns = [
    path("", starting_page, name="home"),
    path("game/", game),
    path("acount/", acount)
]
