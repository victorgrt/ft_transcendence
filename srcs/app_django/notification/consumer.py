import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


# Handles the websocket connection
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("NotificationConsumer.connect")
        self.group_name = 'public_room'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print("NotificationConsumer.disconnect")
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({ 'message': event['message'] }))
