console.log("loaded script.js");
function pongPageScripts () {
    console.log("launchPongScript")

    // connect to game
    connectToGame();
    launchGame();
}

function checkModalBug()
{
    const test = document.getElementsByClassName('modal-backdrop fade show');
    console.log("test:", test);
    if (test && test[0])
        test[0].style.opacity = 0;
}

var loaded;
function loadHome(){
    loaded = isZoomed;
    console.log("LOADING HOME PAGE")
    isZoomed = false;
    isZooming = false;
    duration = 2000;
    initialCameraPosition = new THREE.Vector3(12, 5, 12); // Position initiale de la caméra
    initialCameraLookAt = new THREE.Vector3(0, 0, 0);
    zoomBack();
	loginForm = document.getElementsByClassName("login_form")[0];
	registerForm = document.getElementsByClassName("register_form")[0];
	goBackButton = document.getElementById("footer");
	header = document.getElementById("header");
    settings = document.getElementById('settingsForm');
    loadHeader();
    handleLoginForm();
	handleRegisterForm();
    loadFriends();
    loadChangeProfile();
    checkModalBug();
}

function pongIAPageScripts()
{
    console.log("launchPongIAScript")
    connectToGame(mode='ia');
    // connectToGame();
    launchGameIA();
}

function pongLocalPageScripts()
{
    connectToGame(mode='local');
    // connectToGame();
    launchGameLocal();
}


const page_scripts = {
    // 'gameSession' : loadGameSession,
    'menuPong/' : loadMenuPong,
    '/pong/' : pongPageScripts,
	'' : loadHome,
	'/home/' : loadHome,
    '/pongIA/' : pongIAPageScripts,
    '/pong_local/' :pongLocalPageScripts,
    '/tournament/' : loadTournament,
}

function loadContent(url, pushState = true) {
    console.warn("LOADING CONTENT");

    // Ensure the URL is absolute
    if (url == '/') {
        url = "/home/";  // Adjust the URL as needed
    } else if (!url.startsWith('/')) {
        url = '/' + url;
    }

    // Determine the script to run based on the URL
    let page_url;
    if (url.includes('/pong/')) {
        page_url = '/pong/';
    } else if (url.includes('/pongIA/')) {
        page_url = '/pongIA/';
	} else if (url.includes('/pong_local/')) {
		page_url = '/pong_local/';
    } else if (url.includes('/tournament/')) {
        page_url = '/tournament/';
    } else {
        page_url = url;
    }

    fetch(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.text())
    .then(data => {
        console.log("Fetched URL:", url);
        console.log("DATA OF LOADCONTENT:", data);

        // Update page content
        const mainDiv = document.getElementById('content');
        mainDiv.innerHTML = data;

        // Change URL in browser address bar
        if (pushState) {
            history.pushState({ url: url }, '', url);
        }

        // Load scripts for the page
        if (page_scripts[page_url]) {
            page_scripts[page_url]();
        } else {
            console.log("Page script not found.");
        }
    })
    .catch(error => console.error('Error loading content:', error));
}