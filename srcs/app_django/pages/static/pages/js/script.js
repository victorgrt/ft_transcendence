// console.log("loaded script.js");

function pongPageScripts () {
    // connect to game
    connectToGame();
    launchGame();
}

function checkModalBug()
{
    const test = document.getElementsByClassName('modal-backdrop fade show');
    console.log("test:", test);
    if (test && test[0])
        test[0].style.display = 'none';
}

var loaded;
function loadHome(){
    loaded = isZoomed;
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
    matchHistoryDiv = document.getElementById('match_history_container');
    console.log("HERE:", matchHistoryDiv);
    loadHeader();
    handleLoginForm();
    handleRegisterForm();
    loadFriends();
    loadChangeProfile();
    checkModalBug();
    var is_logged = document.getElementById("stats_username");
    console.log("is_logged:", is_logged);
    if (leftTournament === true && is_logged)
    {
        console.log("should appen the new button");
        //append button go back
        var element = document.getElementById("content");
        if (element)
        {
            var joinDiv = document.createElement('div');

            var joinBtn = document.createElement('button');
            joinBtn.className = 'needed_hover';
            joinBtn.textContent = 'Tournament Page';
            joinBtn.style.position = 'absolute';
            joinBtn.style.left =  '0';
            joinBtn.style.bottom =  '0';
            joinBtn.onclick = function(){
                leftTournament = false;
                backToTournament(tournament_id_just_left);
                return ;
            };

            joinDiv.appendChild(joinBtn);

            element.appendChild(joinDiv);
            element.appendChild(joinBtn);
            console.log("AFTER APPENING");
        }
    }
}

function pongIAPageScripts()
{
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
  '/' : loadHome,
  '/home/' : loadHome,
  '/pongIA/' : pongIAPageScripts,
  '/pong_local/' :pongLocalPageScripts,
  '/tournament/' : loadTournament,
}

function loadContent(url, pushState = true) {
    console.warn("LOADING CONTENT : ", url);

    // Ensure the URL is absolute
    if (url == '/') {
        url = "/home/"; 
    } else if (!url.startsWith('/')) {
        url = '/' + url;
    }

    fetch(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.text())
    .then(data => {

        // Update page content
        const mainDiv = document.getElementById('content');
        mainDiv.innerHTML = data;

        // Change URL in browser address bar
        if (pushState) {
            history.pushState({ url: url }, '', url);
        }

        loadPageScripts();

        handleNavigationEvents();
    })
    .catch(error => console.error('Error loading content:', error));
}


// Function to load associated scripts for the page
function loadPageScripts() {
  console.log("LOADING PAGE SCRIPTS");

  // Get the url from the window
  const url = window.location.pathname;
  console.log("URL: ", url);

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

  // Load scripts for the page
  if (page_scripts[page_url]) {
      page_scripts[page_url]();
  } else {
      console.log("Page script not found.");
  }
}

// Function to prevent all default navigation actions and handle them with loadContent
function handleNavigationEvents () {
    // console.log("HANDLING NAVIGATION EVENTS");

    function handleNavigation(event) {
        event.preventDefault();
        const url = event.target.getAttribute('href');
        loadContent(url);
    }

    // Add event listeners to navigation links
    document.querySelectorAll('a, .nav, .button1, .button2').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

}

// Add event listener for back/forward navigation
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.url) {
      loadContent(event.state.url, false);
  } else {
      loadContent(document.location.pathname, false);
  }
});
window.addEventListener('pushstate', function(event) {
  if (event.state && event.state.url) {
      loadContent(event.state.url, false);
  } else {
      loadContent(document.location.pathname, false);
  }
});

// Initial load to handle direct access or page refresh
loadContent(document.location.pathname, false);