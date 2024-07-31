//SOCKET DE LA GAME SESSION


function setUpSocket(_socket)
{
  console.log("SETTING SOCKET UP");
	_socket.onmessage = function(e) {
        // console.log(e.data)
        const data = JSON.parse(e.data);
        if (data.hasOwnProperty('countdown'))
            countdown = data;
        if (data.hasOwnProperty('game_state'))
        {
            // if (e.data == "waiting" || e.data == "playing")
            gamedata = data;
        }
    };
}

function setUpSocketTournament(_socket)
{
  console.log("SETTING SOCKET UP");
	_socket.onmessage = function(e) {
        // console.log(e.data)
        const data = JSON.parse(e.data);
        if (data.hasOwnProperty('countdown'))
            countdown = data;
        if (data.hasOwnProperty('game_state'))
        {
            // if (e.data == "waiting" || e.data == "playing")
            gamedata = data;
        }
    };
}


function connectWebSocket(url) {
    return new Promise((resolve, reject) => {

        socket = new WebSocket( url);

        socket.addEventListener('open', () => {
            console.log('WebSocket connection established');
            resolve(socket);
        });

        socket.addEventListener('error', (event) => {
            console.error('WebSocket connection failed', event);
            reject(new Error('WebSocket connection failed'));
        });
    });
}

async function createGame ()
{
	console.log("createGame");
	try {
		const response = await fetch('/create_session/')
		const data = await response.json();
		loadContent('/pong/' + data.session_id + '/');
	} catch (error) {
		console.error('Error creating session or connecting WebSocket:', error);
	}
}

async function handleCreateTournament ()
{
	console.log("createGame");
	try {
		const response = await fetch('/create_tournament/');
		const data = await response.json();
		loadContent('/tournament/' + data.tournament_id + '/');
	} catch (error) {
		console.error('Error creating tournament or connecting WebSocket:', error);
	}
}

async function connectToTournament() {
    // Extract session ID from URL
    const tournamentId = window.location.pathname.split('/')[2]
    console.log('Connecting to game:', tournamentId);

    // Try to join the tournament with the given ID
    // If unable, the user will be added to the spectator list
    try {
      // Try to join the tournament with the given ID
      const response = await fetch('/join_tournament/' + tournamentId + '/');
      if (!response.ok) {
          throw new Error('Failed to join tournament');
      }
    }
    catch (error) {
      console.error('Error joining tournament:', error);
    }

    // Connect to the WebSocket
    connectWebSocket('ws://' + window.location.host + '/ws/tournament/' + tournamentId + '/')
        .then(socket => {
            setUpSocket(socket);
        });
}

function connectToGame(mode = "pvp") {
    // Extract session ID from URL
    const gameId = window.location.pathname.split('/')[2]
    console.log('Connecting to tournament:', gameId);

    connectWebSocket(`ws://${window.location.host}/ws/pong/${gameId}/${mode}/`)
        .then(socket => {
            setUpSocket(socket);
        });
}

async function createGameIA()
{
    console.log("createGame");
	try
    {
		const response = await fetch('/create_session/');
		const data = await response.json();
		loadContent('/pongIA/' + data.session_id + '/');
	}
    catch (error)
    {
		console.error('Error creating session or connecting WebSocket:', error);
	}
}

