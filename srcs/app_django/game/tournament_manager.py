class TournamentManager
    def __init__(self, tournament_id):
        self.tournament_id = tournament_id
        self.tournament = Tournament.objects.get(id=game_id)
        self.players = []
        self.consumers = []
        self.nb_players = 0
        self.state = "waiting" # semi_finals, finals, finished

    def add_player(self, player):
        self.players.append(player)
        self.nb_players += 1
        if self.nb_players == 4:
            self.state = "semi_finals"
            self.start_semi_finals()

    def remove_player(self, player):
        self.players.remove(player)
        self.nb_players -= 1
        if self.nb_players < 4:
            self.state = "waiting"

    def update(self):
        if self.state == "semi_finals":
            self.update_semi_finals()
        elif self.state == "finals":
            self.update_finals()
        elif self.state == "finished":
            self.close_tournament()
    
    def start_semi_finals(self):
        # Create two games for the semi finals
        semi_final_game1 = GameSession.objects.create(player1=self.players.pop(), player2=self.players.pop())
        semi_final_game2 = GameSession.objects.create(player1=self.players.pop(), player2=self.players.pop())
        
        # Add the games to the tournament
        self.tournament.semi_final_games.add(semi_final_game1)
        self.tournament.semi_final_games.add(semi_final_game2)

        # Save the tournament
        self.tournament.save()

        for game in semi_final_games:
            game.player1 = self.players.pop()
            game.player2 = self.players.pop()
            game.save()
        self.state = "finals"