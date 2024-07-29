from django.db import models
from django.utils import timezone
from account.models import CustomUser
import uuid

# 1. 👇 Add the following line
# class Notification(models.Model):
#     message = models.CharField(max_length=100)
    
    # def __str__(self):
    #     return self.message

class FriendRequest(models.Model):
	from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="from_user")
	to_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="to_user")
	status = models.CharField(default = 'pending', max_length=50)

class Notification(models.Model):
    to_user = models.ForeignKey(CustomUser, related_name='received_notifications', on_delete=models.CASCADE)
    from_user_username = models.CharField(max_length=150, default="default_sender")  # Champ pour le nom d'utilisateur de l'envoyeur
    type_of_notification = models.CharField(max_length=100, default="default")
    message = models.CharField(max_length=255)
    read = models.BooleanField(default=False)
    notification_id = models.CharField(max_length=255, default="default")

    def __str__(self):
        return f'From {self.from_user_username} to {self.to_user.username}: {self.message}'