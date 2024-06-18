// script.js
console.log("theo ce bg");
// Fonction pour charger le contenu d'une page via Ajax
function loadPage(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById('main').innerHTML = data;
            // Mettre à jour l'URL dans l'historique du navigateur
            history.pushState(null, '', url);
            console.log("history : ", history);
        })
        .catch(error => console.error('Error loading page:', error));
}

// Fonction pour gérer les clics sur les liens
function handleLinkClick(event) {
    event.preventDefault();
    const url = event.target.href;
    loadPage(url);
}

// Écouter les clics sur tous les liens dans le conteneur principal
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('#main a');
    links.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });

    // Gérer la navigation précédente/suivante du navigateur
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.url) {
            loadPage(event.state.url);
        }
    });
});
console.log("theo ce bg22");