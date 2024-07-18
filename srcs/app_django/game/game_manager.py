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
        self.consumers = []
        self.nb_players = 0
        self.seed = seed(1),
        self.dx = 0.05
        self.dy = 0.05
        self.ball_velocity = [self.dx, self.dy]
        self.ballRadius = 10
        self.paddleWidth = 0.8
        self.paddleHeight = 0.2
        self.paddleDepth = 0.2
        self.paddleSpeed = 0.075
        self.fieldHeight = -2.5
        self.fieldWidth = 2.5
        self.ball_position = [0, 0]
        self.ballNextBounce = [0, 0]#pas modifier
        self.defineNextBounce(self.ball_position[0], self.ball_position[1])#pas modifier
        self.player_1_position = 0
        self.player_2_position = 0
        self.player_1_position_z = 3.5
        self.player_2_position_z = -3.5
        self.player_1_score = 0
        self.player_2_score = 0
        self.game_over = False
        self.state = "waiting"  # waiting, playing, Player1 or Player2 for winner

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

    def add_player(self, player, user):
        self.players.append(user)
        self.consumers.append(player)
        self.nb_players += 1

    def remove_player(self, player):
        # self.players.remove(player)
        self.consumers.remove(player)
        self.nb_players -= 1

    def resetBall(self, x):
        self.ball_position[0] = 0
        self.ball_position[1] = 0
        self.ball_velocity[0] =  0.05
        self.ball_velocity[1] =  0.05

    def movePaddle(self, game_id, player, direction) :
        if player == 1 :
            if direction == 'left' and self.player_1_position > -4 :
                self.player_1_position -= self.paddleSpeed
            elif direction == 'right' and self.player_1_position < self.fieldWidth :
                self.player_1_position += self.paddleSpeed
        elif player == 2 :
            if direction == 'left' and self.player_2_position > -4 :
                self.player_2_position -= self.paddleSpeed
            elif direction == 'right' and self.player_2_position < self.fieldWidth :
                self.player_2_position += self.paddleSpeed

    def update(self):
        if (self.player_1_score == 3 or self.player_2_score == 3) and self.state == "playing" :
            winner = "Player1" if self.player_1_score == 3 else "Player2"
            self.state = winner
            # Send game over message 
            async_to_sync(get_channel_layer().group_send)(
                self.game_id,
                {
                    'type': 'game_over',
                    'message': {
                        'winner': winner
                    }
                }
            )
            return
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
            if self.ball_position[0] >= 2.4 or self.ball_position[0] <= -2.4:
                self.ball_velocity[0] = -self.ball_velocity[0]
                # self.defineNextBounce()

            # Handle collision with paddles
            if self.ball_position[1] <= -4 or self.ball_position[1] >= 4:
                if self.ball_position[1] <= -4 :
                    self.player_2_score += 1
                    self.resetBall(1)
                elif self.ball_position[1] >= 4:
                    self.player_1_score += 1
                    self.resetBall(2)

            if(self.ball_position[1] >= self.player_1_position_z - 0.1 and self.ball_position[1] <= self.player_1_position_z + 0.1 and self.ball_position[0] >= self.player_1_position - 0.4 and self.ball_position[0] <= self.player_1_position + 0.4) :
                self.dy = -self.dy
                self.ball_position[1] = self.player_1_position_z - 0.1
                self.ball_velocity[0] *= 1.1
                self.ball_velocity[1] *= 1.1
            if(self.ball_position[1] >= self.player_2_position_z - 0.1 and self.ball_position[1] <= self.player_2_position_z + 0.1 and self.ball_position[0] >= self.player_2_position - 0.4 and self.ball_position[0] <= self.player_2_position + 0.4) :
                self.dy = -self.dy
                self.ball_position[1] = self.player_2_position_z - 0.1
                self.ball_velocity[0] *= 1.1
                self.ball_velocity[1] *= 1.1
            self.send_game_state()

        if self.state == "waiting":
            # If there are enough players, start the game
            if len(self.players) >= 2:
              self.state = "playing"
              print("Game started : %s" % self.game_id)
            self.send_game_state()

    def send_game_state(self):
        # print("Sending game state to group %s" % self.game_id)
        for i in range(len(self.consumers)):
            async_to_sync(self.consumers[i].send_game_state_directly)(
                {
                        'state': self.state,
                        'nb_players': self.nb_players,
                        'ball_position': self.ball_position,
                        'ball_velocity': self.ball_velocity,
                        'player_1_position': self.player_1_position,
                        'player_2_position': self.player_2_position,
                        # 'dx' : self.dx,
                        # 'dy': self.dy,
                        # 'seed' : self.seed,
                        # 'ballRadius' : self.ballRadius,
                        # 'paddleWidth': self.paddleWidth,
                        # 'paddleHeight': self.paddleHeight,
                        # 'paddleSpeed': self.paddleSpeed,
                        # 'fieldHeight': self.fieldHeight,
                        # 'fieldWidth': self.fieldWidth,
                        # 'ballNextBounce': self.ballNextBounce,
                        'player_1_score': self.player_1_score,
                        'player_2_score': self.player_2_score,
                            # Add more game state information as needed
                    }
            )

class GameManager:
    def __init__(self):
        self.games = {}
        self.lock = threading.Lock()

    def create_game(self, game_id):
        with self.lock:
            # Here, check that the game_id is unique
            print("Creating game n %d" % (len(self.games) + 1))
            game = Game(game_id)
            self.games[game_id] = game
            return game

    def get_game(self, game_id):
        return self.games.get(game_id)

    def remove_game(self, game_id):
        with self.lock:
            if game_id in self.games:
                del self.games[game_id]

    def handle_paddle_move(self, game_id, player, direction) :
        with self.lock :
            game = self.get_game(game_id)
            game.movePaddle(game_id, player, direction)

    def update_games(self):
        while True:
            start_time = time.time()
            # print("Updating games. Time : %s" % start_time)
            with self.lock:
                for game in self.games.values():
                    game.update()
            elapsed = time.time() - start_time
            sleep_time = max(0.016 - elapsed, 0)  # Ensures non-negative sleep time
            time.sleep(sleep_time);

game_manager = GameManager()
game_update_thread = threading.Thread(target=game_manager.update_games)
game_update_thread.start()
