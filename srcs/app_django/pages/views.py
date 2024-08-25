from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from account.models import CustomUser  # Adjust the import path according to your project structure
from django.contrib.auth import logout as django_logout
from django.contrib.auth import authenticate, login as django_login
from django.contrib.sessions.models import Session
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from notification.models import FriendRequest
from notification.models import Notification
import uuid
from game.models import MatchHistory, Tournament, GameSession


from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def is_ajax(request):
    return request.headers.get('x-requested-with') == 'XMLHttpRequest'


#   ---------------- FRONT END ----------------

# To move elsewhere
def get_user_match_history(user):
    # Filter matches where the user was either player_1 or player_2
    matches = MatchHistory.objects.filter(Q(player_1=user) | Q(player_2=user))
    # Order by date
    match_history = matches.order_by('-date')

    # Set match user won
    for match in match_history:
        if match.winner == user:
            match.user_won = True
        else:
            match.user_won = False
    print('match history : ')
    print(match_history)
    return match_history

# starting_page
def starting_page(request):
	if request.user.is_authenticated:
		print(f"Authenticated user: {request.user.username}")
		# return render(request, 'base.html', {'username': request.user.username})
		match_history = get_user_match_history(request.user)
		if is_ajax(request):
			return render(request, 'index.html', {'user': request.user, 'match_history': match_history})
		else:
			return render(request, 'base.html', {'user': request.user, 'match_history': match_history})
	else:
		print(f"user not authenticated : {request}")
		if is_ajax(request):
			return render(request, 'index.html')
		else:
			return render(request, 'base.html')

def scene(request):
    return render(request, 'index.html')

# game page

def pong(request, session_id):
    # Fetch the GameSession instance using the provided session_id
    try:
        game_session = GameSession.objects.get(session_id=session_id)
    except GameSession.DoesNotExist:
        print("Pong View: Game session " + session_id + " does not exist")
        return render(request, '404.html')

    # Check that the user is part of the game
    print("Pong View: User " + request.user.username + " is trying to access the game " + session_id)
    if request.user.username not in [game_session.player1, game_session.player2]:
        authorized = False
        print("Pong View: User " + request.user.username + " is not authorized in the game " + session_id)
    else:
        print("Pong View: User " + request.user.username + " is authorized in the game " + session_id)
        authorized = True

    # Prepare the context with the game_session object
    context = {'game_session': game_session, 'authorized': authorized}

    # Render the template with the context
    if is_ajax(request):
        return render(request, 'partials/pong.html', context)
    else:
        return render(request, 'base.html',{'context': context})

# IA game page
def pongIA(request, session_id):
    context = {'session_id': session_id}
    if is_ajax(request):
        return render(request, 'partials/pongIA.html', context)
    else:
        return render(request, 'base.html', {'context': session_id})

# LOCAL game page
def pongLocal(request, session_id):
    context = {'session_id': session_id}
    if is_ajax(request):
        return render(request, 'partials/pong_local.html', context)
    else:
        return render(request, 'base.html', {'context': session_id})

# Tournament page
def tournament(request, tournament_id):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
    except Tournament.DoesNotExist:
        print("Pong View: Tournament " + tournament_id + " does not exist")
        return render(request, '404.html')

    context = {'tournament': tournament}

    if is_ajax(request):
        print("IS AJAX")
        return render(request, 'partials/tournamentPage.html', context)
    else:
        print("IS NOT AJAX")
        return render(request, 'base.html', {'context': context})
    
# User profile page
def profile(request, username):
    user = get_object_or_404(CustomUser, username=username)
    match_history = get_user_match_history(user)
    context = {'user': user, 'match_history': match_history}
    if is_ajax(request):
        return render(request, 'partials/profilePage.html', context)
    else:
        return render(request, 'base.html', {'context': context})

# Game menu
def menuPong(request):
    return render(request, 'partials/menuPong.html')

@csrf_exempt
def send_notification(request):
    if request.method == 'POST':
        pseudo = request.POST.get('pseudo')
        notification_type = request.POST.get('notification_type')
        from_user_username = request.POST.get('from_user')  # Nom d'utilisateur de l'envoyeur

        try:
            to_user = CustomUser.objects.get(username=pseudo)
            from_user = CustomUser.objects.get(username=from_user_username)
            # from_user_username = request.user.username  # Utilisez ceci si l'envoyeur est l'utilisateur authentifié

            # Créer la notification
            Notification.objects.create(
                to_user=to_user,
                from_user_username=from_user_username,
                type_of_notification=notification_type,
                message=f'{from_user_username} wants to {notification_type}'
            )

            # Incrémenter le champ nb_notifs de l'utilisateur destinataire
            to_user.nb_notifs += 1
            to_user.save()

            # Envoi de la notification via WebSocket
            channel_layer = get_channel_layer()
            room_name = f'notification_{to_user.username}'
            async_to_sync(channel_layer.group_send)(
                room_name,
                {
                    'type': 'notification_message',
                    'message': notification_type,
                    'from_user': from_user_username,  # Envoyer le nom d'utilisateur comme chaîne de caractères
                    'from_user_id': from_user.id
                }
            )

            # Réponse de succès
            return JsonResponse({'status': 'success', 'message': 'Notification sent successfully.'})
        except CustomUser.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found.'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request.'})


@csrf_exempt
def accept_friend_request(request):
    if request.method == 'POST':
        notification_id = request.POST.get('notification_id')
        # int_notif_id = int(notification_id)

        try:
            print("NOTIFS ID", notification_id)
            # Récupérer la notification spécifique
            # notification = Notification.objects.get(id=int_notif_id)
            notification = Notification.objects.get(id=notification_id)

            # Récupérer l'utilisateur destinataire de l'invitation
            to_user = notification.to_user

            # Récupérer l'utilisateur qui a envoyé l'invitation
            from_user = notification.from_user_username

            # Ajouter from_user à la liste d'amis de to_user
            to_user.friends.add(from_user)

            # Supprimer la notification après l'acceptation
            notification.delete()

            # Réponse de succès
            return JsonResponse({'status': 'success', 'message': 'Friend request accepted.'})
        except Notification.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Notification not found.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request.'})

def badGateway(request):
    return render(request, 'partials/badGateway.html')
