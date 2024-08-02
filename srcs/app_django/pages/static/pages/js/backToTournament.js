function backToTournament()
{
    tournament_id = document.getElementById('backToTournamentButton').value;
    console.log("BACK TO TOURNAMENT");
    console.log(tournament_id);
    // stop the animation
    isAnimating = false;
    console.log("LEAVING GAME");
    console.log(isAnimating);

    // Remove the game sockets 
    if (socket)
    {
        socket.close();
        console.log("SOCKET CLOSED");
        socket = null;
    }
    
    // Reset game data
    gamedata = null;
    set_camera = 0;
    score_player_1 = 0;
    score_player_2 = 0;
    

    // Load the home page
    loadContent('/tournament/' + tournament_id + '/'); 
}