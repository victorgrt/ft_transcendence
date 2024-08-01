from account.models import CustomUser
from ..models import Notification  # Adjust the import path according to your project structure
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import uuid

def send_notification_service(type, to_user, from_user, data):
    print("send_notification_service")
    try:
        print("try send_notification_service")
        # Créer la notification dans la base de données
        notification = Notification.objects.create(
            to_user=to_user,
            from_user_username=from_user.username,
            type_of_notification=type,
            notification_id = str(uuid.uuid4()),
            message=data,
        )

        # Incrémenter le champ nb_notifs de l'utilisateur destinataire
        to_user.nb_notifs += 1
        to_user.save()
        
        notification_id = notification.notification_id
        print("notification_id:",  notification_id)
        # print("NOTIFICATION ID MON REUF:", notification_id)
        # Envoi de la notification via WebSocket
        channel_layer = get_channel_layer()
        room_name = f'notification_{to_user.username}'
        async_to_sync(channel_layer.group_send)(
            room_name,
            {
                'type': 'notification_message',
                'notification_type': type,
                'from_user': from_user.username, 
                'to_user': to_user.username,
                'data': data,
                'notification_id' : notification_id,
            }
        )
        print(f"Notification sent to {to_user.username} from {from_user.username}")

        # Réponse de succès
        return True;
    except CustomUser.DoesNotExist:
        return False;