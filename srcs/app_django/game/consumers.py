import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .game_manager import game_manager

class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_id = game_id
        print(f"Connecting to game {self.game_id}")
        self.game = game_manager.get_game(game_id)

        if not self.game:
            self.game = game_manager.create_game(game_id)

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
        print(text_data_json)
        print(text_data)
        action = text_data_json['action']

        # Handle player inputs and update game state
        # Example: Update player position, handle paddle movement, etc.
        # print(f"Received message: {message} on game {self.game_id}")
        if action == 'move_paddle' :
            player = text_data_json['player']
            direction = text_data_json['direction']
            game_manager.handle_paddle_move(self.game_id, player, direction)
        else :
            self.send(text_data=json.dumps({
                'error': 'Key "message" not found in WebSocket'
            }))


    # async def game_message(self, event):
    #     message = event['message']
    #     await self.send(text_data=json.dumps({'message': message}))

    async def game_update(self, event):
        message = event['message']
        # print(f"Received message: {message}")
        await self.send(text_data=json.dumps({'game_state': message}))
