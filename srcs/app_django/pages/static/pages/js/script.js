console.log("loaded script");

//pcq c une array
const loginForm = document.getElementsByClassName("login_form")[0];

const page_scripts = {
    'gameSession' : loadGameSession
}

function loadContent(url, pushState = true) {
    console.log(url)
    if (url == '/')
        url = ""

    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log("fected url : ", url);
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
    
function loadGameSession(){

}