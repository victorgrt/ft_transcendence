import threading
import time
from time import sleep
import requests
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from random import seed
from random import random
from django.middleware.csrf import get_token
from django.test import Client

from .tournamentManager import TournamentManager

class Game:
    def __init__(self, game_id):
        self.game_id = game_id  # Ensure the game_id is a valid string
        self.players = []
        self.consumers = []
        self.nb_players = 0
        self.mode = 1
        self.seed = seed(1),
        self.dx = 0.05
        self.dy = 0.05
        self.ball_velocity = [self.dx, self.dy]
        self.ballRadius = 10
        self.paddleWidth = 0.8
        self.paddleHeight = 0.2
        self.paddleDepth = 0.2
        self.paddleSpeed = 0.075
        self.fieldHeight = 2.5
        self.fieldWidth = 2.5
        self.ball_position = [0, 0]
        self.ballNextBounce = [0, 0]#pas modifier
        self.player_1_position = 0
        self.player_2_position = 0
        self.defineNextBounce(self.ball_position[0], self.ball_position[1])#pas modifier
        self.move_1 = 0
        self.move_2 = 0
        self.player_1_position_z = 3.5
        self.player_2_position_z = -3.5
        self.player_1_score = 0
        self.player_2_score = 0
        self.game_over = False
        self.state = "waiting"  # waiting, playing, Player1 or Player2 for winner

    def defineNextBounce(self, x, y):
        x2 = x
        y2 = y
        while (x2 > -2.5 and x2 < 2.5) and (y2 > -4 and y2 < 4) :
            x2 += self.ball_velocity[0] / 20
            y2 += self.ball_velocity[1] / 20

        if (x2 > 2.5) :
            x2 = 2.5
        elif (x2 < -2.5) :
            x2 = -2.5
        if (y2 > 2.5) :
            y2 = 2.5
        elif (y2 < -2.5) :
            y2 = -2.5
        self.ballNextBounce[0] = x2
        self.ballNextBounce[1] = y2
        print("Ball Next Bounce", self.ballNextBounce)
        if (self.player_2_position) :
            print("Player 2 pos : ", self.player_2_position)

    def add_player(self, consumer, user):
        self.players.append(user)
        self.consumers.append(consumer)
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

    def checkIAMode(self, game_id) :
        self.nb_players = 2
        self.mode = 2

    def movePaddle(self, game_id, player, direction) :
        if player == 1 :
            if direction == 'left' and self.player_1_position > -2.5 :
                self.move_1 = -1
            elif direction == 'right' and self.player_1_position < 2.5 :
                self.move_1 = 1
            elif direction == 'null':
                self.move_1 = 0
        elif player == 2 :
            if direction == 'left' and self.player_2_position > -2.5 :
                self.move_2 = -1
            elif direction == 'right' and self.player_2_position < 2.5 :
                self.move_2 = 1
            elif direction == 'null':
                self.move_2 = 0

    def update(self):
        if (self.player_1_score == 3 or self.player_2_score == 3) and self.state == "playing" :
            winner = self.players[0].id if self.player_1_score == 3 else self.players[1].id
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

            # Send request to save game history
            requests.post('http://localhost:8000/game/finished_match/', data={
                'game_id': self.game_id,
                'player_1_id': self.players[0].id,
                'player_2_id': self.players[1].id,
                'player_1_score': self.player_1_score,
                'player_2_score': self.player_2_score,
                'winner_id': winner,
            })

            return

        if self.state == "playing":
            if (self.player_1_position > 2.2 and self.player_1_position < 2.4) or (self.player_1_position < -2.2 and self.player_1_position > -2.4) :
                self.move_1 = 0
            if (self.move_1 != 0):
                if (self.move_1 > 0 and self.player_1_position < 2.3):
                    self.player_1_position += self.paddleSpeed
                elif (self.move_1 < 0 and self.player_1_position > -2.3):
                    self.player_1_position -= self.paddleSpeed
            if (self.player_2_position > 2.2 and self.player_2_position < 2.4) or (self.player_2_position < -2.2 and self.player_2_position > -2.4) :
                self.move_2 = 0
            if(self.move_2 != 0):
                if (self.move_2 > 0 and self.player_2_position < 2.3):
                    self.player_2_position -= self.paddleSpeed
                if (self.move_2 < 0 and self.player_2_position > -2.3):
                    self.player_2_position += self.paddleSpeed
            # Handle ball move
            self.ball_position[0] += self.ball_velocity[0]
            self.ball_position[1] += self.ball_velocity[1]

            # Handle collision with walls
            if self.ball_position[0] >= 2.4 or self.ball_position[0] <= -2.4:
                self.ball_velocity[0] = -self.ball_velocity[0]
                self.defineNextBounce(self.ball_position[0], self.ball_position[1])

            # Handle collision with paddles
            if(self.ball_position[1] >= 3.4 and self.ball_position[1] <= 3.6 and self.ball_position[0] >= self.player_1_position - 0.4 and self.ball_position[0] <= self.player_1_position + 0.4) :
                self.dy = -self.dy
                self.ball_position[1] = self.player_1_position_z - 0.1
                self.ball_velocity[1] = -self.ball_velocity[1]
                self.ball_velocity[1] *= 1.1
                self.defineNextBounce(self.ball_position[0], self.ball_position[1])
            if(self.ball_position[1] <= -3.4 and self.ball_position[1] >= -3.6 and (self.ball_position[0] >= self.player_2_position - 0.4 and self.ball_position[0] <= self.player_2_position + 0.4)) :
                self.dy = -self.dy
                self.ball_position[1] = self.player_2_position_z + 0.1
                self.ball_velocity[1] = -self.ball_velocity[1]
                self.ball_velocity[1] *= 1.1
                self.defineNextBounce(self.ball_position[0], self.ball_position[1])

            # Detect goal
            if self.ball_position[1] <= -4 or self.ball_position[1] >= 4:
                print("GOAL BALL POSITION : ", self.ball_position)
                if self.ball_position[1] <= -4 :
                    self.player_1_score += 1
                    self.resetBall(1)
                elif self.ball_position[1] >= 4:
                    self.player_2_score += 1
                    self.resetBall(2)
            self.send_game_state()

        def gameCountDown(self):
            countdown = 3
            while countdown >= 0:
                async_to_sync(get_channel_layer().group_send)(
                    self.game_id,
                    {
                        'type': 'countdown',
                        'message': {
                            'countdown': countdown
                        }
                    }
                )
                time.sleep(1)  # Wait for 1 second
                countdown -= 1
                if (countdown == -1):
                    async_to_sync(get_channel_layer().group_send)(
                        self.game_id,
                        {
                            'type': 'countdown',
                            'message':{
                                'countdown': -1
                            }
                        }
                    )
        if self.state == "waiting":
            # If there are enough players, start the game
            if self.nb_players >= 2:
              self.send_game_state()
              gameCountDown(self)
              self.state = "playing"
            #   print("Game started : %s" % self.game_id)
            self.send_game_state()


    def send_game_state(self):
        # print("Sending game state to group %s" % self.game_id)
        if (self.mode == 1) :
            if (self.nb_players == 2) :
                player_2_username = self.players[1].username
            else :
                player_2_username = "waiting"
        if (self.mode == 2) :
            async_to_sync(self.consumers[0].send_game_state_directly)(
                {
                        'state': self.state,
                        'nb_players': self.nb_players,
                        'player_1_login': self.players[0].username,
                        'player_2_login': "IA",
                        'ball_position': self.ball_position,
                        'ball_velocity': self.ball_velocity,
                        'player_1_position': self.player_1_position,
                        'player_2_position': self.player_2_position,
                        'player_id': 1,
                        'player_1_score': self.player_1_score,
                        'player_2_score': self.player_2_score,
                        'ballNextBounce': self.ballNextBounce,
                            # Add more game state information as needed
                    }
            )
        else :
            for i in range(len(self.consumers)):
                async_to_sync(self.consumers[i].send_game_state_directly)(
                    {
                            'state': self.state,
                            'nb_players': self.nb_players,
                            'player_1_login': self.players[0].username,
                            'player_2_login': player_2_username,
                            'ball_position': self.ball_position,
                            'ball_velocity': self.ball_velocity,
                            'player_1_position': self.player_1_position,
                            'player_2_position': self.player_2_position,
                            'player_id': i + 1,
                            'player_1_score': self.player_1_score,
                            'player_2_score': self.player_2_score,
                            'ballNextBounce': self.ballNextBounce,
                                # Add more game state information as needed
                        }
                )

class GameManager:
    def __init__(self):
        self.games = {}
        self.tournaments = {}
        self.lock = threading.Lock()

    # Game management

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

    def IAMode(self, game_id) :
        with self.lock :
            game = self.get_game(game_id)
            game.checkIAMode(game_id)

    # Tournament management

    def create_tournament(self, tournament_id):
        with self.lock:
            # Here, check that the game_id is unique
            print("Creating tournament n %d" % (len(self.tournaments) + 1))
            tournament = TournamentManager(tournament_id)
            self.tournaments[tournament_id] = tournament
            return tournament

    def get_tournament(self, tournament_id):
        return self.tournaments.get(tournament_id)

    def remove_tournament(self, tournament_id):
        with self.lock:
            if tournament_id in self.tournaments:
                del self.tournaments[tournament_id]
        

    # Main loop

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

    def update_tournaments(self):
        while True:
            start_time = time.time()
            # print("Updating games. Time : %s" % start_time)
            with self.lock:
                for tournament in self.tournaments.values():
                    tournament.update()
            elapsed = time.time() - start_time
            sleep_time = max(0.016 - elapsed, 0)

game_manager = GameManager()
game_update_thread = threading.Thread(target=game_manager.update_games)
game_update_thread.start()
tournament_update_thread = threading.Thread(target=game_manager.update_tournaments)
tournament_update_thread.start()
