import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_name = f'notification_{self.user.username}'
        self.room_group_name = self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        from_user = text_data_json['from_user']

        print(f"Received message: {message}")

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'notification_message',
                'message': message,
                'from_user': from_user
            }
        )

    # Receive message from room group
    async def notification_message(self, event):
        # message = event['message']
        from_user = event['from_user']
        data = event['data']
        notification_type = event['notification_type']
        print(f"Sending message: {data}")
        print (f"Notification type: {notification_type}")
        print(f"From user: {from_user}")

        await self.send(text_data=json.dumps({
            'notification_type': notification_type,
            'from_user': from_user,
            'data': data,
        }))