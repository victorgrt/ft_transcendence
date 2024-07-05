console.log("loaded script");

//pcq c une array
const loginForm = document.getElementsByClassName("login_form")[0];

// const pongScene = document.getElementById("pongScene")[0];

const page_scripts = {
    // 'gameSession' : loadGameSession,
    'menuPong/' : loadMenuPong,
    '/pong/' : loadPong
}

function loadContent(url, pushState = true) {
    console.log(url)
    if (url == '/')
        url = ""

    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log("fetched url : ", url);
            const mainDiv = document.getElementById('content');
            mainDiv.innerHTML = data;

            if (page_scripts[url])
                page_scripts[url]();
            else
                console.log("pas trouve chef");
            if (pushState) {
                history.pushState({url: url}, '', url);
            }
        })
        .catch(error => console.error('Error loading content:', error));
}

