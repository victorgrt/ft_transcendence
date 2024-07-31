# from account.models import CustomUser, Notification  # Adjust the import path according to your project structure
# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync

# def  	(type, to_user, from_user, data):
#     try:
#         # Créer la notification dans la base de données
#         Notification.objects.create(
#             to_user=to_user,
#             from_user_username=from_user.username,
#             type_of_notification=type,
#             message=data
#         )
        
#         # Incrémenter le champ nb_notifs de l'utilisateur destinataire
#         to_user.nb_notifs += 1
#         to_user.save()

#         # Envoi de la notification via WebSocket
#         channel_layer = get_channel_layer()
#         room_name = f'notification_{to_user.username}'
#         async_to_sync(channel_layer.group_send)(
#             room_name,
#             {
#                 'type': 'notification_message',
#                 'notification_type': type,
#                 'from_user': from_user.username, 
#                 'to_user': to_user.username,
#                 'data': data
#             }
#         )
#         print(f"Notification sent to {to_user.username} from {from_user.username}")

#         # Réponse de succès
#         return True;
#     except CustomUser.DoesNotExist:
#         return False;