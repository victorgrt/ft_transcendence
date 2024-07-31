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

function createGameElement(game) {
    const { player1, player2, winner } = game;

    // Create the main game div
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';

    // Create the player1 span
    const player1Span = document.createElement('span');
    player1Span.className = 'player1';
    player1Span.textContent = player1;

    // Create the player2 span
    const player2Span = document.createElement('span');
    player2Span.className = 'player2';
    player2Span.textContent = player2;

    // Create the VS text node
    const vsText = document.createTextNode(' ⚔️ ');

    // Create the GO link
    const goLink = document.createElement('a');
    goLink.className = 'go_button';
    goLink.href = `/pong/${game.game_id}/`; // Assuming game.session_id is available in this context
    goLink.textContent = 'GO';

    // Create the game_winner div
    const winnerDiv = document.createElement('div');
    winnerDiv.className = 'game_winner';
    winnerDiv.textContent = 'Winner: 🏅 ';

    // Create the winner span
    const winnerSpan = document.createElement('span');
    winnerSpan.textContent = winner || 'TBD';
    winnerDiv.appendChild(winnerSpan);
    winnerSpan.appendChild(document.createTextNode(' 🏅'));

    // Append elements to the gameDiv
    gameDiv.appendChild(player1Span);
    gameDiv.appendChild(vsText);
    gameDiv.appendChild(player2Span);
    gameDiv.appendChild(goLink);
    gameDiv.appendChild(winnerDiv);

    return gameDiv;
}

function createPlayerElement(username) {
    return `<div class="player">
                <span class="player_name">${username}</span>
            </div>`;
}

function createTournamentRankings(players) {
    const rankingsContainer = document.createElement('div');
    rankingsContainer.id = 'tournament_rankings_list';

    players.forEach((player, index) => {
        const rank = index + 1; // Assuming the first player is the winner and so on
        const rankingDiv = document.createElement('div');
        rankingDiv.className = 'ranking';

        const rankSpan = document.createElement('span');
        rankSpan.className = 'rank';
        switch(rank) {
            case 1:
                rankSpan.textContent = '🥇';
                break;
            case 2:
                rankSpan.textContent = '🥈';
                break;
            case 3:
                rankSpan.textContent = '🥉';
                break;
            default:
                rankSpan.textContent = rank;
        }

        const playerNameSpan = document.createElement('span');
        playerNameSpan.className = 'player_name';
        playerNameSpan.textContent = player.username; // Assuming each player object has a username property

        rankingDiv.appendChild(rankSpan);
        rankingDiv.appendChild(playerNameSpan);

        rankingsContainer.appendChild(rankingDiv);
    });

    return rankingsContainer;
}

function updateTournamentData(data)
{
    if (data.players)
    {
        tournamentPlayersList.innerHTML = "";
        data.players.forEach(player => {
            const playerElement = createPlayerElement(player);
            tournamentPlayersList.innerHTML += playerElement;
        });
    }
    if (data.all_games[0] && data.all_games[1])
    {
        tournamentSemiFinals.innerHTML = "";
        const gameElement1 = createGameElement(data.all_games[0]);
        const gameElement2 = createGameElement(data.all_games[1]);
        tournamentSemiFinals.appendChild(gameElement1);
        tournamentSemiFinals.appendChild(gameElement2);
    }
    if (data.all_games[2] && data.all_games[3])
    {
        tournamentFinal.innerHTML = "";
        const finalGameElement = createGameElement(data.all_games[2]);
        const smallFinalGameElement = createGameElement(data.all_games[3]);
        tournamentFinal.appendChild(gameElement);
        tournamentSmallFinal.appendChild(smallFinalGameElement);
    }
    if (data.players_ranking)
    {
        tournamentRanking.innerHTML = "";
        const rankingsElement = createTournamentRankings(data.players_ranking);
        tournamentRanking.appendChild(rankingsElement);
    }
}

function setUpSocketTournament(_socket)
{
  console.log("SETTING SOCKET UP");
	_socket.onmessage = function(e) {
        // console.log(e.data)
        const data = JSON.parse(e.data);
        console.log(data);
        updateTournamentData(data.message);
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
            setUpSocketTournament(socket);
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

