from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser  # Adjust the import path according to your project structure
from django.contrib.auth import logout as django_logout
from django.contrib.auth import authenticate, login as django_login
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required


from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from .models import GameSession
import uuid

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


#   ----            FRONT
def starting_page(request):
    return render(request, 'pages/base.html')

def pong(request):
    # return redirect('pages/partials/pong.html')
    return render(request, 'pages/partials/pong.html')

def menuPong(request):
    return render(request, 'pages/partials/menuPong.html')
def account(request):
    return render(request, 'pages/partials/account.html')

def home_page(request):
    return render(request, 'pages/partials/home_page.html')

def chat(request):
    return render(request, 'pages/partials/chat.html')

def register(request):
    return render(request, 'pages/partials/register.html')

@csrf_exempt  # Only for demonstration; consider CSRF protection for production
def createUser(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        # if CustomUser.objects.count() == 0:
        #     user = CustomUser.objects.create_superuser(username="jquil", email="jquil@jquil.com", password="admin")
        # else :
        user = CustomUser.objects.create_user(username=username, email=email, password=password)
        user.save()

        # return redirect('starting_page')
        return render(request, 'pages/partials/starting_page')
    return HttpResponse("This endpoint expects a POST request.")

@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        if request.user.is_authenticated:
            return redirect('home')
        if user is not None :
            django_login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid email or password. Please try again.')

    # If not a POST request or authentication failed, show the login form
    return render(request, 'pages/partials/login.html')

def get_login_status(request):
    user = request.user
    return JsonResponse({
        'is_logged_in': True,
        'username': user.username,
        'email': user.email,
        'is_active': user.is_active
    })


def scene(request):
    return render(request, 'pages/index.html')
