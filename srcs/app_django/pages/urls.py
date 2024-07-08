# pages/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
from .views import *

urlpatterns = [
    path("", starting_page, name="home"),
    path("pong/", pong),
	path("menuPong/", menuPong),
    path("register/", register),
    path("createUser", createUser),
    path("home_page/", home_page),
	path("login/", login),
	path("logout/", logout),
	path('api/login_status/', get_login_status, name='login_status'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]
