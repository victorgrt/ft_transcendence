console.log("coucou theo")

//SOCKET DE LA GAME SESSION
var socket;
var gamedata;

function setUpSocket(_socket)
{
	_socket.onmessage = function(e) {
	    const data = JSON.parse(e.data);
	    console.log('Received message:', data);
        gamedata = data;
    };
}

function connectWebSocket(sessionId) {
    return new Promise((resolve, reject) => {
        //if (sessionId != )
        socket = new WebSocket('ws://' + window.location.host + '/ws/pong/' + sessionId + '/');

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
		const response = await fetch('/create_session/');
		const data = await response.json();

		// const socket = await connectWebSocket(data.session_id);
    // setUpSocket(socket);
		// console.log('Session created with ID:', data.session_id);
		// window.location.href = '/pong/'
		loadContent('/pong/' + data.session_id + '/');
	} catch (error) {
		console.error('Error creating session or connecting WebSocket:', error);
	}
}

function connectToGame() {
    // Extract session ID from URL
    const sessionId = window.location.pathname.split('/')[2]
    console.log('Connecting to session:', sessionId);

    connectWebSocket(sessionId)
        .then(socket => {
            setUpSocket(socket);
        });
}


function loadMenuPong(){
	document.getElementById('joinSessionBtn').addEventListener('click', function() {
		console.log("ici");
        const sessionId = document.getElementById('game_id');
		// const sessionId = document.getElementById('sessionIdInput').value;
        console.log(sessionId);
		loadContent('/pong/' + sessionId + '/');
	});

	document.getElementById('createSessionBtn').addEventListener('click', createGame);
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
