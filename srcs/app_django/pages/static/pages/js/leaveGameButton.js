console.log("LEAVE GAME BUTTON");
function leaveGame()
{
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
    let keys = {};

    // Remove the event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    // Load the home page
    loadContent('/');
}