from django.shortcuts import render, redirect
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
from .models import GameSession
from account.models import FriendRequest
from account.models import Notification
import uuid

#notifs par chatgpt
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def is_ajax(request):
    return request.headers.get('x-requested-with') == 'XMLHttpRequest'

#   ---------------- API ----------------

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


#   ---------------- FRONT END ----------------

# PARTIAL CONTENTS
def partial_content(request, page):
    context = {}
    if page == 'page1':
        context['data'] = 'Page 1 content'
        template = 'partials/page1.html'
    elif page == 'page2':
        context['data'] = 'Page 2 content'
        template = 'partials/page2.html'
    else:
        return JsonResponse({'error': 'Page not found'}, status=404)

    if request.is_ajax():
        return render(request, template, context)
    else:
        return render(request, 'index.html', {'partial_template': template, 'context': context})

# starting_page
def starting_page(request):
    if request.user.is_authenticated:
        print(f"Authenticated user: {request.user.username}")
        # return render(request, 'base.html', {'username': request.user.username})
        return render(request, 'pages/index.html', {'user': request.user})
    else:
        print(f"user not authenticated : {request}")
        return render(request, 'pages/partials/login.html')

def scene(request):
    return render(request, 'pages/index.html')

# game page
def pong(request, session_id):
    context = {'session_id': session_id}
    if is_ajax(request):
        return render(request, 'pages/partials/pong.html', context)
    else:
        return render(request, 'pages/index.html', {'partial_template': 'pages/partials/pong.html', 'context': session_id})

# IA game page
def pongIA(request):
    return render(request, 'pages/partials/pongIA.html')
    # return render(request, 'pages/partials/pong.html')

# Game menu
def menuPong(request):
    return render(request, 'pages/partials/menuPong.html')

# def account(request):
#     return render(request, 'pages/partials/account.html')

# Chat page
def chat(request):
    return render(request, 'pages/partials/chat.html')

@csrf_exempt
def send_notification(request):
    if request.method == 'POST':
        pseudo = request.POST.get('pseudo')
        notification_type = request.POST.get('notification_type')
        from_user_username = request.POST.get('from_user')  # Nom d'utilisateur de l'envoyeur
        
        try:
            to_user = CustomUser.objects.get(username=pseudo)
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
                    'from_user': from_user_username  # Envoyer le nom d'utilisateur comme chaîne de caractères
                }
            )

            # Réponse de succès
            return JsonResponse({'status': 'success', 'message': 'Notification sent successfully.'})
        except CustomUser.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found.'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request.'})