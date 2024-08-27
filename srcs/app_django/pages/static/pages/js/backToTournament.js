function backToTournament(previous_id)
{
    if (!previous_id)
    {    
        tournament_id = document.getElementById('backToTournamentButton').value;
        console.log("BACK TO TOURNAMENT");
        console.log(tournament_id);
        // stop the animation
        isAnimating = false;
        console.log("LEAVING GAME");
        console.log(isAnimating);
    }
    else
        tournament_id = previous_id;
    console.log("inside :", tournament_id);
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
    let keys = {};

    // Remove the event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    // Load the home page
    loadContent('/tournament/' + tournament_id + '/'); 
}