from django.db import models
from django.utils import timezone
from account.models import CustomUser

# 1. 👇 Add the following line
# class Notification(models.Model):
#     message = models.CharField(max_length=100)
    
    # def __str__(self):
    #     return self.message

class FriendRequest(models.Model):
	from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="from_user")
	to_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="to_user")

class Notification(models.Model):
    to_user = models.ForeignKey(CustomUser, related_name='received_notifications', on_delete=models.CASCADE)
    from_user = models.ForeignKey(CustomUser, related_name='sent_notifications', on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=timezone.now)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f'From {self.from_user.username} to {self.to_user.username}: {self.message}'