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
    '/tournament/' : loadTournament,
}

function loadContent(url, pushState = true) {
    console.warn(" LOADING CONTENT BOY : ", url);
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

// Prevemt default link behavior and call the loadContent function instead
document.addEventListener('click', function(event) {
    // Check if the clicked element is an <a> tag
    let target = event.target;
    while (target != null && target.tagName !== 'A') {
        target = target.parentElement;
    }
    if (target && target.tagName === 'A' && target.href) {
        // Prevent the default link behavior
        event.preventDefault();

        // Extract the URL path from the href attribute
        const urlPath = new URL(target.href).pathname;

        // Call the loadContent function with the extracted URL path
        loadContent(urlPath);
    }
});
