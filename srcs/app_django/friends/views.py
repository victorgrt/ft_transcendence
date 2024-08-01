from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from account.models import CustomUser
from notification.models import Notification
from notification.services.notification_services import send_notification_service
import json
from django.http import JsonResponse


# Create your views here.
def is_friend(request):
	print('IN is_friend')
	if request.method == 'POST':
		current_user = request.user
		data = json.loads(request.body)
		friend_name = data.get('friend_name')
		print('friend_name:', friend_name)
		print(request.user.friends.all())
	if current_user.friends.filter(username=friend_name).exists():
		print('	returning True')
		return JsonResponse({'success': True, 'message': 'User is a friend!'}, status=200)
	else:
		print('	returning False')
		return JsonResponse({'success': False, 'message': 'User is not a friend!'})
		# Additional logic can be added here, such as saving the data to the database
		# return JsonResponse({'success': True, 'message': f'Friend {friend_name} added successfully!'})

# send_notification_service(friend_user, 'Friend Request', f'{request.user.username} has sent you a friend request.')

@csrf_exempt
def send_friend_request(request):
	print('IN send_friend_request')
	# Extract data from the request	
	if request.method == 'POST':
		data = json.loads(request.body)
		print('	IN post method')
		to_username = data.get('friend_name')
		from_username = request.user.username
		to_user = CustomUser.objects.get(username=to_username)
		from_user = CustomUser.objects.get(username=from_username)
  
		if not to_user or not from_user:
			return JsonResponse({'error': 'user not found'}, status=404)
		# test = None
		# If successful, send a notification to the recipient
		send_notification_service('friend', to_user, from_user, "friend request received")
		print('	Friend Notification sent')
	# Last, return the session_id
	return JsonResponse({'success': True}, status=200)

@csrf_exempt
def accept_friend_request(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            notification_data = data.get('data', {})
            print('NOTIF FRIEND:', notification_data)
            
            from_user_username = notification_data.get('from_user_username')
            notification_id = notification_data.get('notification_id')
            
            from_user = CustomUser.objects.get(username=from_user_username)
            to_user = request.user
            
            from_user.friends.add(to_user)
            to_user.friends.add(from_user)
            
            Notification.objects.get(notification_id=notification_id).delete()
            print(from_user.friends.all())
            print("WE GOT HERE")
            return JsonResponse({'success': True})
    except CustomUser.DoesNotExist:
        print("HERE MAYBE???")
        return JsonResponse({'message': 'User does not exist!'}, status=404)
    except Notification.DoesNotExist:
        print("LA?")
        return JsonResponse({'message': 'Friend request does not exist!'}, status=404)
    except Exception as e:
        print("HERE???")
        return JsonResponse({'message': str(e)}, status=500)

@csrf_exempt
def deny_notification(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            notification_data = data.get('data', {})
            notification_id = notification_data.get('notification_id')
            
            Notification.objects.get(notification_id=notification_id).delete()
            return JsonResponse({'success': True})
    except CustomUser.DoesNotExist:
        return JsonResponse({'message': 'User does not exist!'}, status=404)
    except Notification.DoesNotExist:
        return JsonResponse({'message': 'Friend request does not exist!'}, status=404)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)

def get_user_friends(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'User not authenticated'}, status=401)
    
    friends = user.friends.all()
    friends_list = [
        {
            'username': friend.username,
            'email': friend.email,
            'avatar': friend.avatar.url if friend.avatar else None,
            'is_online': friend.is_online,
            'register_date': friend.register_date,
        }
        for friend in friends
    ]
    
    return JsonResponse({'success': True, 'friends': friends_list})
