from django.shortcuts import render
from .models import MatchHistory
from account.models import CustomUser
from django.contrib.auth import get_user_model
from .models import GameSession, Tournament
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from notification.services.notification_services import send_notification_service

# Create your views here.
# Add record to the MatchHistory model. 
@csrf_exempt
def finished_match(request):
    # Extract data from the request
    player_1_id = request.POST.get('player_1_id')
    player_2_id = request.POST.get('player_2_id')
    winner_id = request.POST.get('winner_id')
    player_1_score = request.POST.get('player_1_score')
    player_2_score = request.POST.get('player_2_score')
    game_id = request.POST.get('game_id')

    print("winner_id")
    print(winner_id)
    print(player_1_id)
    print(player_2_id)
    print(player_1_score)
    print(player_2_score)

    # Create a new record in the MatchHistory model
    user_winner = get_user_model().objects.get(id=winner_id)
    user_player_1 = get_user_model().objects.get(id=player_1_id)
    user_player_2 = get_user_model().objects.get(id=player_2_id)
    game = GameSession.objects.get(session_id=game_id)
    new_match = MatchHistory.objects.create(winner=user_winner, player_1=user_player_1, player_2=user_player_2, player_1_score=player_1_score, player_2_score=player_2_score , game_id=game.id)

    # Save the record
    new_match.save()

    return JsonResponse({'success': 'Match history saved'})

def create_session(request):
    session_id = str(uuid.uuid4())
    game_session = GameSession.objects.create(player1='player1', session_id=session_id, state='{}')
    return JsonResponse({'session_id': session_id})

def create_tournament(request):
    tournament_id = str(uuid.uuid4())
    print(tournament_id)
    tournament = Tournament.objects.create(id=tournament_id, name='tournament', state='waiting')
    return JsonResponse({'tournament_id': tournament_id})

def join_tournament(request, tournament_id):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        user = request.user

        # If the player is already in the tournament, return success
        if user in tournament.players.all():
            return JsonResponse({'success': 'Joined tournament'}, status=200)
 
        # TODO : Check if the tournament is full
        # TODO : Check if the user is already in the tournament
        # TODO : check if the user belongs to invited players ? 

        tournament.players.add(user)
        tournament.save()
        return JsonResponse({'success': 'Joined tournament'})
    except Tournament.DoesNotExist:
        return JsonResponse({'error': 'Tournament not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': 'Failed to join tournament'}, status=500)

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

@csrf_exempt
def send_play_request (request):
    # Extract data from the request
    to_username = request.POST.get('to_username')
    from_username = request.user.username

    to_user = CustomUser.objects.get(username=to_username)
    from_user = CustomUser.objects.get(username=from_username)

    if not to_user or not from_user:
        return JsonResponse({'error': 'user not found'}, status=404)

    # Try to create game session
    try :
        session_id = str(uuid.uuid4())
        game_session = GameSession.objects.create(player1=from_username, player2=to_username, session_id=session_id, state='{}')
    except Exception as e:
        print("HERE BRO")
        return JsonResponse({'error': 'Failed to create game session'}, status=500)
    print ('Game session created')
    # If successful, send a notification to the recipient
    notification_data = {
        'session_id': session_id
    }
    send_notification_service('play', to_user, from_user, notification_data)
    print('Notification sent')
    # Last, return the session_id
    return JsonResponse({'session_id': session_id}, status=200)
