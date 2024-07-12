from django.shortcuts import render
from .models import MatchHistory
from account.models import CustomUser
from django.contrib.auth import get_user_model

# Create your views here.
# Add record to the MatchHistory model. 
def finished_match(request, winner_id, loser_id):
	user_winner = get_user_model().objects.get(id=winner_id)
	user_loser = get_user_model().objects.get(id=loser_id)
	new_match = MatchHistory.objects.create(winner=user_winner, loser=user_loser)
