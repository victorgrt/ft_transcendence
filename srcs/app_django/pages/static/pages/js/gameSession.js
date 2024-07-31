//SOCKET DE LA GAME SESSION


function setUpSocket(_socket)
{
  console.log("SETTING SOCKET UP");
	_socket.onmessage = function(e) {
	    const data = JSON.parse(e.data);
	    console.log('Received message:', data);
        //gamedata = data;
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

		// const socket = await connectWebSocket(data.session_id);
    // setUpSocket(socket);
		// console.log('Session created with ID:', data.session_id);
		// window.location.href = '/pong/'
		loadContent('pong/' + data.session_id + '/');
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



function connectToGame() {
    // Extract session ID from URL
    const gameId = window.location.pathname.split('/')[2]
    console.log('Connecting to tournament:', gameId);

    connectWebSocket('ws://' + window.location.host + '/ws/pong/' + gameId + '/')
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

function loadMenuPong(){
    console.log("coucou vivi");
	document.getElementById('createTournamentBtn').addEventListener('click', handleCreateTournament);
	document.getElementById('createSessionBtn').addEventListener('click', createGame);
	document.getElementById('IAButton').addEventListener('click', createGameIA);
	document.getElementById('joinSessionBtn').addEventListener('click', function() {
		console.log("ici");
		    const sessionId = document.getElementById('sessionIdInput').value;
        console.log(sessionId);
		    loadContent('/pong/' + sessionId + '/');
	});

}

document.addEventListener('DOMContentLoaded', function() {

    function handleNavigation(event) {
        event.preventDefault();
        const url = event.target.getAttribute('href');
        loadContent(url);
    }

    document.querySelectorAll('.nav, .button1, .button2').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.url) {
            loadContent(event.state.url, false);
        } else {
            loadContent(document.location.pathname, false);
        }
    });

    // Initial load to handle direct access or page refresh
    if (document.location.pathname !== '/') {
        loadContent(document.location.pathname, false);
    }
});

//game/multi/id



    // document.addEventListener('DOMContentLoaded', function() {
    //     fetch('/api/login_status/')
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.is_logged_in) {
    //                 document.getElementById('username').textContent = data.username;
    //                 document.getElementById('email').textContent = data.email;
    //                 document.getElementById('is_active').textContent = 'Connected';
    //             } else {
    //                 document.getElementById('username').textContent = 'N/A';
    //                 document.getElementById('email').textContent = 'N/A';
    //                 document.getElementById('is_active').textContent = 'Disconnected';
    //             }
    //         })
            // .catch(error => {
            //     console.error('Error fetching user info:', error);
            // });
    // });

        // JavaScript pour le jeu Pong

        // Logique du jeu Pong ici...
