# pages/urls.py
from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from .views import *

urlpatterns = [
  # path('partial/<str:page>/', partial_content, name='partial_content'),

  # navigation
  path("", starting_page, name="home"),
  path("menuPong/", menuPong),

  # account
	path('account/', include("account.urls")),
	
 
  # notification
	path('notification/', include("notification.urls")),


  # notifs
  path('send-notification/', send_notification, name='send_notification'),
  path('accept-friend-request/', accept_friend_request),
  # Game
  path("pong/<str:session_id>/", pong, name="pong_session"),  # Add this line
]
