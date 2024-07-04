# pages/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    # path("", starting_page, name="home"),
    path("pong/", pong),
	path("menuPong/", menuPong),
    path("register/", register),
    path("createUser", createUser),
    path("home_page/", home_page),
	path("login/", login),
	path('api/login_status/', get_login_status, name='login_status'),
    path("account/", account),
    path("home_page/", home_page),
    path("", scene, name="home"),
    path('create_session/', create_session, name='create_session'),
    path('join_session/<str:session_id>/', join_session, name='join_session')
]
