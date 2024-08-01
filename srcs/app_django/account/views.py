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
# from .models import GameSession
from notification.models import FriendRequest
from notification.models import Notification
import uuid
from django.core.exceptions import ValidationError
from django.db import IntegrityError
import json


@csrf_exempt
def is_user(request):
    print('IN IS USER')
    if request.method == 'POST':
        try:
            # Parse JSON body
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            print("USER NAME ICI:", username)
            
            if CustomUser.objects.filter(username=username).exists():
                print("USERNAME FOUND HERE")
                return JsonResponse({'success': True, 'message': 'Username found!'}, status=200)
            else:
                return JsonResponse({'success': False, 'message': 'User not found!'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

@login_required
def settings(request):
    if request.method == 'POST':
        new_username = request.POST.get('new_username')
        new_avatar = request.FILES.get('new_avatar')
        user = request.user

        if new_username and CustomUser.objects.filter(username=new_username).exclude(pk=user.pk).exists():
            return JsonResponse({'success': False, 'message': 'Username already taken.'}, status=400)

        if new_username:
            user.username = new_username

        if new_avatar:
            user.avatar = new_avatar

        user.save()
        return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)

@csrf_exempt
def createUser(request):
	if request.method == 'POST':
		username = request.POST.get('username')
		email = request.POST.get('email')
		if CustomUser.objects.filter(username=username).exists():
			return JsonResponse({'success': False, 'message': 'Username is already taken.'}, status=409)
		if CustomUser.objects.filter(email=email).exists():
			return JsonResponse({'success': False, 'message': 'Email is already registered.'},  status=409)
		password = request.POST.get('password')
		avatar = request.FILES.get('avatar')
		user = CustomUser.objects.create_user(username=username, email=email, password=password, is_superuser=False, is_staff=False, avatar=avatar)
		user.is_active = True
		request.session['username'] = username
		request.session.save()
		user.save()
		# login(request)
		return JsonResponse({'success': True, 'message': 'Registered successfully'},  status=200)
	return HttpResponse("This endpoint expects a POST request.",  status=405)

@csrf_exempt
def login(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    if username and password:
        print(f"Attempting to authenticate user: {username}")
        # Authenticate user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            request.session['username'] = username
            user.is_online = True
            user.save()
            print(f"Authentication successful for user: {username}")
            django_login(request, user)
            request.session.save()
            return JsonResponse({"message": "Successfully logged in."}, status=200)
        else:
            print("failed to log in.")
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

def logout(request):
	request.user.is_online = False
	request.user.save()
	django_logout(request)
	Session.objects.filter(session_key=request.session.session_key).delete()
	response = JsonResponse({'success': True, 'message': 'Logged out successfully'})	
	response.delete_cookie('csrftoken')  # Adjust the cookie name if necessary
	return response

def get_user_data(request):
    if request.method == 'GET':
        username = request.GET.get('username')  # Use request.GET.get() for query parameters
        try:
            user = CustomUser.objects.get(username=username)
            return JsonResponse({
                'username': user.username,
                'is_active': user.is_active,
                'email': user.email,
                'avatar': user.get_avatar_name(),
                'success': True
            })
        except CustomUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found!'}, status=404)


# Not used
def get_login_status(request):
    user = request.user
    print(user.username)
    print(user.email)

    return JsonResponse({
        'is_logged_in': True,
        'username': user.username,
        'email': user.email,
        'is_active': user.is_active,
        'user_avatar': user.avatar.url,
    })

def get_user_notifications(request):
    user = request.user
    all_pending_notifications = Notification.objects.filter(to_user=user)
    notifications_list = [
        {
            'from_user_username': notification.from_user_username,
            'type_of_notification': notification.type_of_notification,
            'message': notification.message,
            'read': notification.read,
            'notification_id': notification.notification_id,
        }
        for notification in all_pending_notifications
    ]
    return JsonResponse({'success': True, 'notifications': notifications_list}, safe=False)