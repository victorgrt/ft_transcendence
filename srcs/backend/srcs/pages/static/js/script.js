document.addEventListener('DOMContentLoaded', function() {
    function loadContent(url, pushState = true) {
        console.log(url)
        if (url == '/')
            url = "/home_page"

        fetch(url)
            .then(response => response.text())
            .then(data => {
                const mainDiv = document.getElementById('main');
                mainDiv.innerHTML = data;

                if (pushState) {
                    history.pushState({url: url}, '', url);
                }
            })
            .catch(error => console.error('Error loading content:', error));
    }

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
    