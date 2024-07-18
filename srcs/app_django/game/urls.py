# pages/urls.py
from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from .views import *

urlpatterns = [
  path('create_session/', create_session, name='create_session'),
  path('join_session/<str:session_id>/', join_session, name='join'),
  path('game/finished_match/', finished_match, name='finished_match'),
]
