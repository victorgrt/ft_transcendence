function loadTournament()
{
    // Get the elememts of the tournament page
    tournamentPlayersList = document.getElementById("tournament_players_list");
    tournamentSemiFinals = document.getElementById("tournament_semi_finals");
    tournamentFinal = document.getElementById("tournament_final");
    tournamentSmallFinal = document.getElementById("tournament_small_final");
    tournamentRanking = document.getElementById("tournsemi_final_game1ament_ranking");

    
    console.log("Loading tournament page");
    console.log("tournamentPlayersList:", tournamentPlayersList);
    console.log("tournamentSemiFinals:", tournamentSemiFinals);
    console.log("tournamentFinal:", tournamentFinal);
    console.log("tournamentSmallFinal:", tournamentSmallFinal);
    console.log("tournamentRanking:", tournamentRanking);
    connectToTournament();
}
