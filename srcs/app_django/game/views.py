from django.shortcuts import render
from .models import MatchHistory
from account.models import CustomUser
from django.contrib.auth import get_user_model
from .models import GameSession
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
# Add record to the MatchHistory model. 
@csrf_exempt
def finished_match(request):
    # Extract data from the request
    winner_id = request.POST.get('winner_id')
    loser_id = request.POST.get('loser_id')
    print("winner_id")
    print(winner_id)
    print(loser_id)

    user_winner = get_user_model().objects.get(id=winner_id)
    user_loser = get_user_model().objects.get(id=loser_id)
    new_match = MatchHistory.objects.create(winner=user_winner, loser=user_loser)

    return JsonResponse({'success': 'Match history saved'})

def create_session(request):
    session_id = str(uuid.uuid4())
    game_session = GameSession.objects.create(player1='player1', session_id=session_id, state='{}')
    return JsonResponse({'session_id': session_id})

def join_session(request, session_id):
    try:
        game_session = GameSession.objects.get(session_id=session_id)
        if game_session.player2:
            return JsonResponse({'error': 'Session already full'}, status=400)
        game_session.player2 = 'player2'
        game_session.save()
        return JsonResponse({'success': 'Joined game session'})
    except GameSession.DoesNotExist:
        return JsonResponse({'error': 'Session not found'}, status=404)

