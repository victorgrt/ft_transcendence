function loadElementForHeader(){
    loginForm = document.getElementsByClassName("login_form")[0];
    registerForm = document.getElementsByClassName("register_form")[0];
    goBackButton = document.getElementById("footer");
    header = document.getElementById("header");
    contentdiv = document.getElementById("content");
    statsDiv = document.getElementById("user_stats");
    matchHistoryDiv = document.getElementById("match_history");
    GHDiv = document.getElementById("game_history");
    friendsDiv = document.getElementById("friends");
    notifDiv = document.getElementById("notif");
    paramsDiv = document.getElementById("change_prof");
    menuPongDiv = document.getElementById("menuPongDiv");
    notifsDiv = document.getElementById("notifications");
}

function loadHeader(){
    console.log("LOADING HEADER");
    loadElementForHeader();
    const header = document.getElementById("header");
    header.style.visibility = 'visible';
    header.style.opacity = '1';
    const headerUser = document.getElementById("header_button_stats");
    const headerMatchHistory = document.getElementById("header_button_history");
    const headerFriends = document.getElementById("header_button_friends");
    const headerSettings = document.getElementById("header_button_settings");
    const headerLogout = document.getElementById("header_button_logout");

    console.log(headerUser);
	console.log(headerMatchHistory);
	console.log(headerFriends);
	console.log(headerSettings);
    console.log(headerLogout);

	notifsVisible = false;
	paramsVisible = false;
	statsVisible = false;
	friendsVisible = true;
	matchHistoryBool = true;

    if (headerUser) {
        headerUser.addEventListener('click', showStats);
    }
    if (headerMatchHistory) {
        headerMatchHistory.addEventListener('click', showMatchHistory);
    }
    if (headerFriends) {
        headerFriends.addEventListener('click', showFriends);
    }
    if (headerSettings) {
        headerSettings.addEventListener('click', showParams);
    }
    if (headerLogout){
        headerLogout.addEventListener('click', headerLogoutFunction);
    }
}
