console.log("loaded script.js");

function pongPageScripts () {
    console.log("launchPongScript")

    // connect to game
    connectToGame();
    launchGame();
}

function loadHome(){
	loginForm = document.getElementsByClassName("login_form")[0];
	registerForm = document.getElementsByClassName("register_form")[0];
	goBackButton = document.getElementById("footer");
	header = document.getElementById("header");
	handleLoginForm();
	handleRegisterForm();
	console.log("here:", loginForm);
}
function pongIAPageScripts()
{
    connectToGame(mode='ia');
    // connectToGame();
    launchGameIA();
}


const page_scripts = {
    // 'gameSession' : loadGameSession,
    'menuPong/' : loadMenuPong,
    '/pong/' : pongPageScripts,
	'' : loadHome,
    '/pongIA/' : pongIAPageScripts,
    '/tournament/' : connectToTournament,
}

function loadContent(url, pushState = true) {
    console.warn(" LOADIG CONTENT BOY")
    if (url == '/')
        url = ""

    // if there is a trailing session id, remove it
    if (url.includes('/pong/'))
        page_url = '/pong/'
    else if (url.includes('/pongIA/'))
        page_url = '/pongIA/'
    else if (url.includes('/tournament/'))
        page_url = '/tournament/'
    else
        page_url = url


    fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.text())
        .then(data => {
            console.log("fetched url : ", url);

            // Update page content
            const mainDiv = document.getElementById('content');
            mainDiv.innerHTML = data;

            // Change URL in browser address bar
            if (pushState) {
                history.pushState({url: url}, '', url);
            }

            // Load scripts for the page
            if (page_scripts[page_url])
              page_scripts[page_url]();
            else
                console.log("pas trouve chef");
        })
        .catch(error => console.error('Error loading content:', error));
}

