
from .models import GameSession, Tournament
from account.models import CustomUser
from django.db import connection
from channels.db import database_sync_to_async
import uuid

# MANUAL DATABASE CONNECTIONS
# @database_sync_to_async
# def create_game_session(player1, player2):
#     game = GameSession.objects.create(player1=player1, player2=player2)
#     return game

# @database_sync_to_async
# def add_semi_final_game(tournament, game):
#     game = GameSession.objects.create(player1=player1, player2=player2)
#     return game

def create_game_session_in_thread(player1, player2, tournament_id):
    try:
        session_id = str(uuid.uuid4())
        game = GameSession.objects.create(player1=player1.username, player2=player2.username, session_id=session_id, state='{}', tournament_id=tournament_id)
        connection.close()  # Close the connection explicitly
        return game
    except:
        print("Error creating game session")
        print(connection.queries)
        connection.close()  # Ensure the connection is closed even if an error occurs

def add_semi_final_game(tournament_id, game):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        tournament.semi_final_games.add(game)
        tournament.save()
        # Print all game id in the tournament
        print(f"Games in tournament {tournament_id} : {[game.id for game in tournament.semi_final_games.all()]}")
        connection.close()  # Close the connection explicitly
        return game
    except:
        print("Error adding semi final game")
        print(connection.queries)
        connection.close()  # Ensure the connection is closed even if an error occurs


class TournamentManager:
    def __init__(self, tournament_id):
        self.tournament_id = tournament_id
        # self.tournament = tournament
        self.players = []
        self.consumers = []
        self.all_games = []
        self.semi_finals_games = []
        self.final_game = None
        self.small_final_game = None
        self.nb_players = 0
        self.state = "waiting" # semi_finals, finals, finished

    def add_player(self, player, consumer):
        self.players.append(player)
        self.consumers.append(consumer)
        self.nb_players += 1
        print(f"Player {player.username} added to tournament {self.tournament_id}")
        print(f"Number of players in tournament : {self.nb_players}")

    def remove_player(self, player, consumer):
        self.players.remove(player)
        self.consumers.remove(consumer)
        self.nb_players -= 1

    # TODO WARNING : should be protected by a lock
    def get_players(self):
        return self.players

    def update(self):
        # print(f"Updating tournament {self.tournament_id} in state {self.state}")
        if self.state == "waiting":
            if self.nb_players == 4:
                self.start_semi_finals()
        if self.state == "semi_finals":
            self.update_semi_finals()
        elif self.state == "finals":
            self.update_finals()
        elif self.state == "finished":
            self.close_tournament()

    def create_game_item(self, game_id):
        game = {
            "game_id": game_id,
            "finished": False,
            "winner": None,
            "loser": None
        }
        self.all_games.append(game)
        return game;
    
    def start_semi_finals(self):
        # Create two games for the semi finals
        semi_final_game1 = create_game_session_in_thread(self.players[0], self.players[1], self.tournament_id)
        semi_final_game2 = create_game_session_in_thread(self.players[2], self.players[3], self.tournament_id)

        # Create the game items that serve to keep track of the games
        semi_final_game1_item = self.create_game_item(semi_final_game1.session_id)
        semi_final_game2_item = self.create_game_item(semi_final_game2.session_id)
        
        print(f"semi_final_game1 created : {semi_final_game1}")
        print(f"semi_final_game2 created : {semi_final_game2}")

        # Add the games to the tournament
        add_semi_final_game(self.tournament_id, semi_final_game1)
        add_semi_final_game(self.tournament_id, semi_final_game2)
        
        print(f"semi_final_games setup complete")
        
        # Set the tournament state to semi_finals
        self.state = "semi_finals"

    def start_finals(self):
        print("Starting finals")

    def update_semi_finals(self):
        # If game 1 and game 2 are finished, start the finals
        if self.all_games[0]["finished"] and self.all_games[1]["finished"]:
            self.start_finals()
        
    
    # TODO WARNING : should be protected by a lock
    def set_game_result(self, game_id, winner_id, loser_id):
        print(f"Tournament manager received game result")
        # Find the games array
        game = next((game for game in self.all_games if game["game_id"] == game_id), None)

        # TODO : handle the case where the game is not found ?
        if not game:
            print(f"Game {game_id} not found")
            return

        # Update the game result
        game["finished"] = True
        game["winner"] = winner_id
        game["loser"] = loser_id

        print(f"Tournament manager acknowledged : Game {game_id} finished. Winner : {winner_id}, Loser : {loser_id}")