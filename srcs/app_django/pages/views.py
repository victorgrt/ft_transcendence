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


