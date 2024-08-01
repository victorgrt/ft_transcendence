
from channels.layers import get_channel_layer
from .models import GameSession, Tournament, TournamentRanking
from account.models import CustomUser
from django.db import connection
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync

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

def add_final_game(tournament_id, game):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        tournament.final_game = game
        tournament.save()
        connection.close()  # Close the connection explicitly
        return game
    except:
        print("Error adding final game")
        print(connection.queries)
        connection.close()  # Ensure the connection is closed even if an error occurs

def add_small_final_game(tournament_id, game):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        tournament.small_final_game = game
        tournament.save()
        connection.close()  # Close the connection explicitly
        return game
    except:
        print("Error adding small final game")
        print(connection.queries)
        connection.close()  # Ensure the connection is closed even if an error occurs

def create_or_update_rankings(tournament_id, player, rank):
    try:
        
        connection.close()
    except Exception as e:
        print(f"Error creating/updating rankings: {e}")
        connection.close()

def create_or_update_rankings(tournament_id, player, rank):
    try:
        # Fetch the tournament instance
        tournament = Tournament.objects.get(id=tournament_id)
        
        # Update existing ranking or create a new one
        ranking, created = TournamentRanking.objects.update_or_create(
            tournament=tournament,
            player=player,
            defaults={'rank': rank},
        )
        
        if created:
            print(f"Created new ranking for player {player.username} in tournament {tournament.name}")
        else:
            print(f"Updated ranking for player {player.username} in tournament {tournament.name}")
        
        connection.close()
    except Exception as e:
        print(f"Error creating/updating rankings: {e}") 
        connection.close()


class TournamentManager:
    def __init__(self, tournament_id, game_manager):
        self.tournament_id = tournament_id
        self.game_manager = game_manager
        # self.tournament = tournament
        self.players = []
        self.consumers = []
        self.all_games = []
        self.rankings = []
        self.nb_players = 0
        self.state = "waiting" # semi_finals, finals, finished

    def add_player(self, player, consumer):
        # Always subscribe the consumer to the tournament
        self.consumers.append(consumer)

        # Add the player to the tournament if still possible
        if not player in self.players and self.nb_players < 4:
            self.players.append(player)
            self.nb_players += 1
            print(f"Player {player.username} added to tournament {self.tournament_id}")
            print(f"Number of players in tournament : {self.nb_players}")

    def remove_player(self, player, consumer):
        if player in self.players:
            self.players.remove(player)
            self.nb_players -= 1
        if consumer in self.consumers:
            self.consumers.remove(consumer)

    # TODO WARNING : should be protected by a lock
    def get_players(self):
        return self.players

    def update(self):
        # print(f"Updating tournament {self.tournament_id} in state {self.state}")
        self.send_tournament_state()
        if self.state == "waiting":
            if self.nb_players == 4:
                self.setup_semi_finals()
        if self.state == "semi_finals":
            self.update_semi_finals()
        elif self.state == "finals":
            self.update_finals()

    def send_tournament_state(self):
        state = {
            "players" : [player.username for player in self.players],
            "rankings" : self.rankings,
            "tournament_id" : self.tournament_id,
            "all_games" : self.all_games,
            "nb_players" : self.nb_players,
            "state" : self.state,
            "finished" : False,
        }

        # Group send the state to all consumers
        async_to_sync(get_channel_layer().group_send)(
            self.tournament_id,
            {
                'type': 'tournament_state',
                'message': state
            }
        )

    def create_game_item(self, game_id, player1_username, player2_username):
        game = {
            "game_id": game_id,
            "finished": False,
            "player1": player1_username,
            "player2": player2_username,
            "winner": None,
            "loser": None
        }
        self.all_games.append(game)
        return game;
    
    def setup_semi_finals(self):
        # Create two games for the semi finals
        semi_final_game1 = create_game_session_in_thread(self.players[0], self.players[1], self.tournament_id)
        semi_final_game2 = create_game_session_in_thread(self.players[2], self.players[3], self.tournament_id)

        # Create the game items that serve to keep track of the games
        semi_final_game1_item = self.create_game_item(semi_final_game1.session_id, self.players[0].username, self.players[1].username)
        semi_final_game2_item = self.create_game_item(semi_final_game2.session_id, self.players[2].username, self.players[3].username)
        
        print(f"semi_final_game1 created : {semi_final_game1}")
        print(f"semi_final_game2 created : {semi_final_game2}")

        # Add the games to the tournament
        add_semi_final_game(self.tournament_id, semi_final_game1)
        add_semi_final_game(self.tournament_id, semi_final_game2)
        
        print(f"semi_final_games setup complete")
        
        # Set the tournament state to semi_finals
        self.state = "semi_finals"

    def setup_finals(self):
        print("Setup finals")

        # Create the final game
        winner1 = self.all_games[0]["winner"]
        winner2 = self.all_games[1]["winner"]
        self.final_game = create_game_session_in_thread(winner1, winner2, self.tournament_id)

        # Create the small final game
        loser1 = self.all_games[0]["loser"]
        loser2 = self.all_games[1]["loser"]
        self.small_final_game = create_game_session_in_thread(loser1, loser2, self.tournament_id)

        # Create the tracking game items 
        final_game_item = self.create_game_item(self.final_game.session_id, winner1.username, winner2.username)
        small_final_game_item = self.create_game_item(self.small_final_game.session_id, loser1.username, loser2.username)

        # Add the games to the tournament
        add_final_game(self.tournament_id, self.final_game)
        add_small_final_game(self.tournament_id, self.small_final_game)

        # Set the tournament state to finals
        self.state = "finals"

    def update_semi_finals(self):
        # If game 1 and game 2 are finished, start the finals
        if self.all_games[0]["finished"] and self.all_games[1]["finished"]:
            self.setup_finals()
    
    def update_finals(self):
        # If the finals are finished, close the tournament
        if self.all_games[2]["finished"] and self.all_games[3]["finished"]:
            self.finish_tournament()
            self.finish_tournament()

    def finish_tournament(self):
        print(f"Tournament {self.tournament_id} finished")

        # Set the ranks 
        create_or_update_rankings(self.tournament_id, self.all_games[2]["winner"], 1)
        create_or_update_rankings(self.tournament_id, self.all_games[2]["loser"], 2)
        create_or_update_rankings(self.tournament_id, self.all_games[3]["winner"], 3)
        create_or_update_rankings(self.tournament_id, self.all_games[3]["loser"], 4)

        # Set the rankings 
        self.rankings = [
            self.all_games[2]["winner"].username,
            self.all_games[2]["loser"].username,
            self.all_games[3]["winner"].username,
            self.all_games[3]["loser"].username
        ]

        self.state = "finished"
        # self.game_manager.remove_tournament(self.tournament_id)
        
        
    
    # TODO WARNING : should be protected by a lock
    def set_game_result(self, game_id, winner, loser):
        print(f"Tournament manager received game result")
        # Find the games array
        game = next((game for game in self.all_games if game["game_id"] == game_id), None)

        # TODO : handle the case where the game is not found ?
        if not game:
            print(f"Game {game_id} not found")
            return

        # Update the game result
        game["finished"] = True
        game["winner"] = winner
        game["loser"] = loser

        print(f"Tournament manager acknowledged : Game {game_id} finished. Winner : {winner.username}, Loser : {loser.username}")