from django.shortcuts import render
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser  # Adjust the import path according to your project structure
from django.contrib.auth import logout as django_logout
from django.contrib.auth import authenticate, login as django_login
from django.contrib.sessions.models import Session
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
# from .models import GameSession
from .models import FriendRequest
from .models import Notification
import uuid
from django.core.exceptions import ValidationError
from django.db import IntegrityError


# def register(request):
#     return render(request, 'account/register.html')

def settings(request):
	print('IN SETTINGS')
	if request.method == 'POST':
		new_username = request.POST.get('new_username')
		new_avatar = request.FILES.get('new_avatar')
		user = request.user

		# Check if the new username already exists
		print("USER NAME :'", new_username, "'")
		print("NEW AVATAR :", new_avatar)

		if CustomUser.objects.filter(username=new_username).exclude(pk=user.pk).exists() and new_username:
			messages.error(request, 'Username already taken. Please choose a different one.')
			print("ON RETURN LA")
			return redirect('home')

		if new_username:
			print("COUCOU ON EST LAAAAAAAAAAAAa")
			user.username = new_username

		if new_avatar:
			print("COUCOU ON EST ICI")
			user.avatar = new_avatar

		user.save()
	print("ON SORT DIRECTEMENT")
	return redirect('home')

@csrf_exempt  # Only for demonstration; consider CSRF protection for production
def createUser(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        avatar = request.FILES.get('avatar')

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

        # return render(request, 'account/login.html')
        return redirect('home')
    return HttpResponse("This endpoint expects a POST request.")

@csrf_exempt
def login(request):
    
    username = request.POST.get('username')
    password = request.POST.get('password')

    print(username)
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
            return JsonResponse({"message": "Successfully logged in."}, status=200)
        else:
            print("failed to log in.")
            messages.error(request, 'Invalid username or password. Please try again.')
            # return error 
            return JsonResponse({"message": "Invalid username or password. Please try again."}, status=401)
    else:
        messages.error(request, 'Please provide both username and password.')
        return JsonResponse({"message": "Please provide both username and password."}, status=401)

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

# def search_friend(request, userID):


@login_required
def send_friend_request(request):
	print('IN SEND FRIEND REQUEST')
	if request.method == 'POST':
		from_user = request.user
		to_user_username = request.POST.get('searched_user')
		try:
			to_user = CustomUser.objects.get(username=to_user_username)
		except CustomUser.DoesNotExist:
			return HttpResponse("User not found", status=404)
		if from_user.username == to_user_username:
			return JsonResponse({"message": "You cannot send a friend request to yourself."}, status=400)
		# if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
		# 	return JsonResponse({"message": "Friend request already sent."}, status=409)
		 # Create a friend request or get the existing one
		friend_request, created = FriendRequest.objects.get_or_create(from_user=from_user, to_user=to_user)
		if created:
			notification_message = f"{from_user.username} has sent you a friend request."
			Notification.objects.create(to_user=to_user, from_user=from_user, message=notification_message)
			# return HttpResponse("Friend request sent")
			return JsonResponse({"message": "Friend request sent successfully."}, status=200)
		return JsonResponse({"message": "Friend request sent successfully."}, status=200)

	# # to_user = CustomUser.objects.get(username=username)
	# FriendRequest, created = FriendRequest.objects.get_or_create(from_user=from_user, to_user=to_user)
	# if created:
	# else:
	# 	return HttpResponse("Friend request already sent")

@login_required
def accept_friend_request(request, requestID):
	friend_request = FriendRequest.objects.get(id=requestID)
	if friend_request == FriendRequest.objects.get(id=requestID):
		friend_request.to_user.friends.add(FriendRequest.from_user)
		friend_request.from_user.friends.add(FriendRequest.to_user)
		friend_request.delete()
		return HttpResponse('Friend request accepted')
	else:
		return HttpResponse('Friend request not accepted')

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

# Create your views here.
