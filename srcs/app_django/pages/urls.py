# pages/urls.py
from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from .views import *

urlpatterns = [
  # path('partial/<str:page>/', partial_content, name='partial_content'),

  # navigation
  path("", scene, name="home"),
  path("menuPong/", menuPong),

  # account
	path('account/', include("account.urls")),

  # notifs
  path('send-notification/', send_notification, name='send_notification'),
  path('accept-friend-request/', accept_friend_request),
  # Game
  path('create_session/', create_session, name='create_session'),
  path('join_session/<str:session_id>/', join_session, name='join_session'),
  path("pong/<str:session_id>/", pong, name="pong_session"),  # Add this line
]
