import threading
import time
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Game:
    def __init__(self, game_id):
        self.game_id = f"game_{game_id}"  # Ensure the game_id is a valid string
        self.players = []
        self.ball_position = [0, 0]
        self.ball_velocity = [1, 1]
        self.player_1_position = [0]
        self.game_over = False

    def add_player(self, player):
        self.players.append(player)

    def remove_player(self, player):
        self.players.remove(player)

    def update(self):
        # Update game state, e.g., move ball, check collisions
        self.ball_position[0] += self.ball_velocity[0]
        self.ball_position[1] += self.ball_velocity[1]
        # Add more game logic here
        self.player_1_position[0] += 1;
        # Send the updated game state to the WebSocket group
        self.send_game_state()

    def send_game_state(self):
        # print("Sending game state to group %s" % self.game_id)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.game_id,
            {
                'type': 'game_update',
                'message': {
                    'ball_position': self.ball_position,
                    'player_1_position': self.player_1_position,
                    # Add more game state information as needed
                }
            }
        )

class GameManager:
    def __init__(self):
        self.games = {}
        self.lock = threading.Lock()

    def create_game(self):
        print("Creating game n %d" % (len(self.games) + 1))
        game_id = len(self.games) + 1
        game = Game(game_id)
        self.games[game_id] = game
        return game

    def get_game(self, game_id):
        return self.games.get(game_id)

    def remove_game(self, game_id):
        if game_id in self.games:
            del self.games[game_id]

    def update_games(self):
        while True:
            with self.lock:
                for game in self.games.values():
                    game.update()
            time.sleep(0.016)  # 60 FPS

game_manager = GameManager()
game_update_thread = threading.Thread(target=game_manager.update_games)
game_update_thread.start()
