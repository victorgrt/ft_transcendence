import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = f'notification_{self.scope["user"].username}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print(f"Connected to WebSocket: {self.room_group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"Disconnected from WebSocket: {self.room_group_name}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"Received data: {data}")
        # Handle the received data if necessary

    async def notification_message(self, event):
        message = event['message']
        print(f"Sending message: {message}")
        await self.send(text_data=json.dumps({
            'message': message
        }))
