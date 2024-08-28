function loadMenuPong() {
  // console.log("coucou vivi");
  const sessionError = document.getElementById('sessionError');
  document.getElementById('createTournamentBtn').addEventListener('click', handleCreateTournament);
  document.getElementById('createSessionBtn').addEventListener('click', createGame);
  document.getElementById('IAButton').addEventListener('click', createGameIA);
  document.getElementById('LocalButton').addEventListener('click', createGameLocal);
  document.getElementById('joinSessionBtn').addEventListener('click', async function()
    {
      // First try to connect to join the game
      const sessionId = document.getElementById('sessionIdInput').value;

      // Try to join the session with the given ID
      fetch('/join_session/' + sessionId + '/')
        .then(
          response => {
            console.log(response)
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json(); // Assuming the server responds with JSON
        })
        .then(data => {
          // If successful, load the game page
          loadContent('/pong/' + sessionId + '/');
        })
        .catch(error => {
          // If unable to join session, display an error message
          sessionError.innerText = 'Cannot join session with ID ' + sessionId;
          console.error('Error joining session:', error);
        })
    });
}


