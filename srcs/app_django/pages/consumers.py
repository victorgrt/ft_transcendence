import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .game_manager import game_manager

class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_id = f"game_{game_id}"  # Ensure the game_id is a valid string
        print(f"Connecting to game {self.game_id}")
        self.game = game_manager.get_game(game_id)

        if not self.game:
            self.game = game_manager.create_game()

        self.game.add_player(self)
        await self.channel_layer.group_add(self.game_id, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        self.game.remove_player(self)
        if not self.game.players:
            game_manager.remove_game(self.game_id)
        await self.channel_layer.group_discard(self.game_id, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Handle player inputs and update game state
        # Example: Update player position, handle paddle movement, etc.
        await self.channel_layer.group_send(
            self.game_id,
            {
                'type': 'game_message',
                'message': message
            }
        )

    # async def game_message(self, event):
    #     message = event['message']
    #     await self.send(text_data=json.dumps({'message': message}))

    async def game_update(self, event):
        message = event['message']
        print(f"Received message: {message}")
        await self.send(text_data=json.dumps({'game_state': message}))
