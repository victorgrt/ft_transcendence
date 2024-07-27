from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from account.models import CustomUser
from notification.services.notification_services import send_notification_service
import json

# Create your views here.
def is_friend(request):
	if request.method == 'POST':
		current_user = request.user
		friend_name = request.POST.get('friend_name')
	if current_user.friends.filter(username=friend_name).exists():
		return JsonResponse({'success': True, 'message': 'User is a friend!'})
	else:
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
		print('IN post method')
		to_username = data.get('friend_name')
		from_username = request.user.username
		to_user = CustomUser.objects.get(username=to_username)
		from_user = CustomUser.objects.get(username=from_username)
		if not to_user or not from_user:
			return JsonResponse({'error': 'user not found'}, status=404)
		# test = None
		# If successful, send a notification to the recipient
		send_notification_service('friend', to_user, from_user, "friend request recieved")
		print('Friend Notification sent')
	# Last, return the session_id
	return JsonResponse({'success': True}, status=200)