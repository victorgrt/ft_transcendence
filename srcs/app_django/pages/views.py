from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser  # Adjust the import path according to your project structure
from django.contrib.auth import logout as django_logout
from django.contrib.auth import authenticate, login as django_login
from django.contrib.sessions.models import Session
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
    if request.user.is_authenticated:
        print(f"Authenticated user: {request.user.username}")
        # return render(request, 'base.html', {'username': request.user.username})
        return render(request, 'pages/index.html', {'user': request.user})
    else:
        print(f"user not authenticated : {request}")
        return render(request, 'pages/partials/login.html')

def pong(request, session_id):
    # return redirect('pages/partials/pong.html')
    return render(request, 'pages/partials/lobby.html')

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
        avatar = request.FILES.get('avatar')
        
        # if CustomUser.objects.count() == 0:
        #     user = CustomUser.objects.create_superuser(username="jquil", email="jquil@jquil.com", password="admin")
        # else :
        print("Creating user")
        print(username)
        print(email)
        print(password)
        user = CustomUser.objects.create_user(username=username, email=email, password=password, is_superuser=False, is_staff=False, avatar=avatar)
        user.is_active = True
        request.session['username'] = username
        request.session.save()
        # user.is_staff = False
        user.save()

        return render(request, 'pages/partials/login.html')
    return HttpResponse("This endpoint expects a POST request.")

@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        print(username)
    #     print(password)
    #     try:
    #         user = CustomUser.objects.get(username=username)
    #         if (user.check_password(password)):
    #             print("Password is correct")
    #             django_login(request, user)
    #             print(f"User '{username}' found in the database.")
    #             print(f"is_active: {user.is_active}")
    #             print('redirecting to home')
    #             return redirect('home')
    #         else:
    #             print("Password is correct")
    #             return render(request, 'pages/partials/login.html')
    #     except CustomUser.DoesNotExist:
    #         print(f"User '{username}' does not exist in the database.")
    # return render(request, 'pages/partials/login.html')
       
        # user = CustomUser.objects.get(username=username)
        # if user.is_active:
        #     print("User is active" )
        
        if username and password:
            print(f"Attempting to authenticate user: {username}")
            # Authenticate user
            user = authenticate(request, username=username, password=password)

            if user is not None:
                print(f"Authentication successful for user: {username}")
                print("Successfully logged in.")
                django_login(request, user)
                # set user-specific data in the session
                request.session['username'] = username
                request.session.save()
                messages.success(request, 'You have successfully logged in.')
                # return render(request, 'pages/partials/home_page.html')
                return redirect('home')
            else:
                print("failed to log in.")
                messages.error(request, 'Invalid username or password. Please try again.')

        else:
            messages.error(request, 'Please provide both username and password.')
    return render(request, 'pages/partials/login.html')

def user_avatar(request):
    if request.user.is_authenticated:
        try:
            user_profile = CustomUser.objects.get(username=request.user.username)
            avatar_url = user_profile.avatar.url
        except CustomUser.DoesNotExist:
            # URL for a default avatar if the user hasn't uploaded one
            avatar_url = "{% static 'images/default_avatar.jpg' %}"
    else:
        avatar_url = None
    return render(request, 'index.html', {'avatar_url': avatar_url})

def logout(request):
    print('IN LOGOUT')
    django_logout(request)
    Session.objects.filter(session_key=request.session.session_key).delete()
    return redirect('home')

def get_login_status(request):
    user = request.user
    print(user.username)
    print(user.email)

    return JsonResponse({
        'is_logged_in': True,
        'username': user.username,
        'email': user.email,
        'is_active': user.is_active
    })


def scene(request):
    return render(request, 'pages/index.html')
