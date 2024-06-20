# pages/urls.py
from django.urls import path
from .views import *

# from .views import game
# from .views import acount

urlpatterns = [
    path("", starting_page, name="home"),
    path("game/", game),
    path("acount/", acount),
    path("home_page/", home_page)
]
