# pages/urls.py
from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from .views import *

urlpatterns = [
  path("send_play_request/", send_play_request, name="send_play_request"),

  # Game endpoints
  path('create_session/', create_session, name='create_session'),
  path('join_session/<str:session_id>/', join_session, name='join'),
  path('game/finished_match/', finished_match, name='finished_match'),

  # Tournament endpoints
  path('create_tournament/', create_tournament, name='create_tournament'),
  path('join_tournament/<str:tournament_id>/', join_tournament, name='join_tournament'),
]
