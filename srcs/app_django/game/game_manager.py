import threading
import time
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from random import seed
from random import random

class Game:
    def __init__(self, game_id):
        self.game_id = game_id  # Ensure the game_id is a valid string
        self.players = []
        self.nb_players = 0
        self.seed = seed(1),
        self.dx = 5 + (random() * (2 + 2) - 2)
        self.dy = 5 + (random() * (2 + 2) - 2)
        self.ball_velocity = [self.dx, self.dy]
        self.ballRadius = 10
        self.paddleWidth = 20
        self.paddleHeight = 200
        self.paddleSpeed = 8
        self.fieldHeight = 600
        self.fieldWidth = 300
        self.ball_position = [self.fieldWidth / 2, self.fieldHeight / 2]
        self.ballNextBounce = [0, 0]
        self.defineNextBounce(self.ball_position[0], self.ball_position[1])
        self.player_1_position = 0
        self.player_2_position = 0
        self.player_1_score = 0
        self.player_2_score = 0
        self.game_over = False
        self.state = "playing"  # waiting, playing, game_over

    def defineNextBounce(self, x, y):
        x2 = x
        y2 = y
        if self.ball_velocity[0] > 0 :
            while x2 < self.fieldHeight - self.ballRadius and (y2 > 0 and y2 < self.fieldWidth):
                x2 += self.ball_velocity[0] / 20
                y2 += self.ball_velocity[1] / 20
        else :
            while x2 > self.ballRadius and (y2 > 0 and y2 < self.fieldWidth) :
                x2 += self.ball_velocity[0] / 20
                y2 += self.ball_velocity[1] / 20
        self.ballNextBounce[0] = x2
        self.ballNextBounce[1] = y2

    def add_player(self, player):
        self.players.append(player)
        self.nb_players += 1

    def remove_player(self, player):
        self.players.remove(player)
        self.nb_players -= 1

    def resetBall(self, x):
        self.ball_position[0] = self.fieldWidth / 2
        self.ball_position[1] = self.fieldHeight / 2
        self.ball_velocity[0] =  5 + (random() * (2 + 2) - 2)
        self.ball_velocity[1] =  5 + (random() * (2 + 2) - 2)
        if x == 2 :
            self.ball_velocity[0] *= -1

    def update(self):
        if self.player_1_score == 3 or self.player_2_score == 3 :
            if self.player_1_score == 3 :
                self.state = "Player1"
            else :
                self.state = "Player2"
        if self.state == "playing":
            #   --- Handle paddle move
              # if (wPressed1 && self.player_1_position > 0)
                # self.player_1_position -= self.paddleSpeed
              # else if (sPressed1 && self.player_1_position < canvas.height - self.paddleHeight)
                # self.player_1_position += self.paddleSpeed
              # if (wPressed2 && self.player_2_position > 0)
                # self.player_2_position -= self.paddleSpeed
              # else if (sPressed2 && self.player_2_position < canvas.height - self.paddleHeight)
                # self.player_2_position += self.paddleSpeed

            # Handle ball move
            self.ball_position[0] += self.ball_velocity[0]
            self.ball_position[1] += self.ball_velocity[1]

            # Handle collision with walls
            if self.ball_position[1] + self.ballRadius >= self.fieldHeight or self.ball_position[1] - self.ballRadius <= 0:
                self.ball_velocity[1] *= -1
                self.defineNextBounce()

            # Handle collision with paddles
            if self.ball_position[0] - self.ballRadius <= self.player_1_position and self.ball_position[1] >= self.player_1_position and self.ball_position[1] <= self.player_1_position + self.paddleHeight :
                self.ball_velocity[0] *= -1
                self.ball_velocity[0] += 0.6
                self.ball_position[0] += self.ballRadius
                self.defineNextBounce()
            elif self.ball_position[0] + self.ballRadius >= self.player_2_position and self.ball_position[1] >= self.player_2_position and self.ball_position[1] <= self.player_2_position + self.paddleHeight :
                self.ball_velocity[0] *= -1
                self.ball_velocity[0] -= 0.6
                self.ball_position[0] -= self.ballRadius
                self.defineNextBounce()
              # Send the updated game state to the WebSocket group

            # Detect goal
            if self.ball_position[0] <= 0 :
                if self.ballNextBounce[0] <= 20 :
                    if self.ballNextBounce[1] <= self.player_1_position and self.ballNextBounce[1] >= self.player_1_position + self.paddleHeight :
                        self.ball_position[0] = 100
                        self.ball_velocity[0] += 0.6
                        if self.ball_velocity[0] < 0 :
                            self.ball_velocity[0] *= -1
                else :
                    self.player_2_score += 1
                    self.resetBall(1)
            elif self.ball_position[0] >= self.fieldWidth :
                if self.ballNextBounce[0] >= self.fieldWidth - 20 :
                    if self.ballNextBounce[1] <= self.player_2_position and self.ballNextBounce[1] <= self.player_2_position + self.paddleHeight :
                        self.ball_position[0] = self.fieldWidth - self.paddleWidth - self.ballRadius
                        self.ball_velocity[0] -= 0.6
                        if self.ball_velocity[0] > 0 :
                            self.ball_velocity[0] *= -1
                else :
                    self.player_1_score += 1
                    self.resetBall(2)

        if self.state == "waiting":
            # If there are enough players, start the game
            if len(self.players) >= 2:
              self.state = "playing"

        self.send_game_state()

    def send_game_state(self):
        # print("Sending game state to group %s" % self.game_id)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.game_id,
            {
                'type': 'game_update',
                'message': {
                    'state': self.state,
                    'nb_players': self.nb_players,
                    'ball_position': self.ball_position,
                    'ball_velocity': self.ball_velocity,
                    'player_1_position': self.player_1_position,
                    'player_2_position': self.player_2_position,
                    'dx' : self.dx,
                    'dy': self.dy,
                    'seed' : self.seed,
                    'ballRadius' : self.ballRadius,
                    'paddleWidth': self.paddleWidth,
                    'paddleHeight': self.paddleHeight,
                    'paddleSpeed': self.paddleSpeed,
                    'fieldHeight': self.fieldHeight,
                    'fieldWidth': self.fieldWidth,
                    'ballNextBounce': self.ballNextBounce,
                    'player_1_score': self.player_1_score,
                    'player_2_score': self.player_2_score,
                        # Add more game state information as needed
                }
            }
        )

class GameManager:
    def __init__(self):
        self.games = {}
        self.lock = threading.Lock()

    def create_game(self, game_id):
        # Here, check that the game_id is unique
        print("Creating game n %d" % (len(self.games) + 1))
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
            # time.sleep(1)

game_manager = GameManager()
game_update_thread = threading.Thread(target=game_manager.update_games)
game_update_thread.start()
