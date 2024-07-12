const loginForm = document.getElementsByClassName("login_form")[0];
const registerForm = document.getElementsByClassName("register_form")[0];
const goBackButton = document.getElementById("footer");
const header = document.getElementById("header");
const contentdiv = document.getElementById("content");
const statsDiv = document.getElementById("user_stats");
const friendsDiv = document.getElementById("friends");
const paramsDiv = document.getElementById("change_prof");

console.log("loaded script");

//pcq c une array

// const pongScene = document.getElementById("pongScene")[0];

function pongPageScripts () {
    console.log("launchPongScript")

    // connect to game
    connectToGame();
    launchGame();
}


const page_scripts = {
    // 'gameSession' : loadGameSession,
    'menuPong/' : loadMenuPong,
    '/pong/' : pongPageScripts,
}

function loadContent(url, pushState = true) {
    console.log(url)
    if (url == '/')
        url = ""

    // if there is a trailing session id, remove it
    if (url.includes('/pong/'))
        page_url = '/pong/'
    else
        page_url = url

    fetch(url)
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

