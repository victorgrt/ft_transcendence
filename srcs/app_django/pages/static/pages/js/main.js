console.log("main script is loaded")
loadHeader();
var loginVisible;
var registerVisible;
var menuPongVisible;
var notifsVisible = false;
var paramsVisible = false;
var statsVisible = false;
var friendsVisible = true;

dontClick = false;

var isZoomed = localStorage.getItem('isZoomed') === 'true'; // Pour suivre l'état de zoom;
var isZooming = false;
var couchZoomed = false;

const initialCameraPosition = new THREE.Vector3(12, 5, 12); // Position initiale de la caméra
const initialCameraLookAt = new THREE.Vector3(0, 0, 0); // Point vers lequel la caméra regarde initialement
const duration = 2000; //Duree du zoom


function hideEverything(){
    if (registerVisible === true)
        {
            hideElement(registerForm);
            registerVisible = false;
        }
        if (loginVisible === true)
        {
            hideElement(loginForm);
            loginVisible = false;
        }
        if (menuPongVisible === true)
        {
            hideElement(menuPongDiv);
            menuPongVisible = false;
        }
        if (statsVisible === true)
        {
            hideElement(statsDiv);
            statsVisible = false;
        }
        if (friendsVisible === true)
        {
            hideElement(friendsDiv);
            friendsVisible = false;
        }
        if (paramsVisible === true)
        {
            hideElement(paramsDiv);
            paramsVisible = false;
        }
        if (matchHistoryBool === true)
        {
            hideElement(matchHistoryDiv);
            matchHistoryBool = false;
        }
}


function goToLogin() {
    if (isZoomed === false && isZooming === false)
        zoomToPC();
    if (registerVisible === true)
    {   
        registerForm.style.visibility = 'hidden';
        registerForm.style.opacity = '0';
        resetStyleForms();
        registerVisible = false;
    }    
    loginVisible = true;
    centerLoginForm();
    showElement(loginForm);
}

function goToRegister() {
    if (isZoomed === false && isZooming === false)
        zoomToPC();
    if (loginVisible === true)
    {
        loginForm.style.visibility = 'hidden';
        loginForm.style.opacity = '0';
        resetStyleForms();
        loginVisible = false;
    }
    registerVisible = true;
    centerRegisterForm();
    registerForm.style.opacity = '1';
    registerForm.style.visibility = 'visible';
    registerForm.style.z_index = '2';
}


function centerRegisterForm()
{

    contentdiv.style.display = 'flex';
    contentdiv.style.justify_content = 'center';
    contentdiv.style.align_items = 'center';
    registerForm.style.width = '80%';
    loginForm.style.position = 'absolute';
}

function centerLoginForm()
{
    contentdiv.style.display = 'flex';
    contentdiv.style.justify_content = 'center';
    contentdiv.style.align_items = 'center';

    loginForm.style.width = '50%';

    registerForm.style.position = 'absolute';
}

function showElement(element)
{
    if (!element)
        return;
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    element.style.z_index = '4';
}

function hideElement(element) {
    if (!element)
        return;
    if (element.classList.contains("register_form"))
        registerVisible = true;
    if (element.classList.contains("login_form"))
        loginVisible = true;
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    element.style.z_index = '-2';
    console.log("z_index assigne :", element.style.z_index);
}

function resetStyleForms(){
    contentdiv.style.removeProperty('display');
    contentdiv.style.removeProperty('align_items');
    contentdiv.style.removeProperty('justify_content');

    registerForm.style.visibility = '0';
    registerForm.style.opactity = '0';
    registerForm.style.removeProperty('width');

    // RESET login form style
    loginForm.style.removeProperty('width');
    loginForm.style.removeProperty('position');
    loginForm.style.removeProperty('height');
    registerForm.style.removeProperty('position');
}

function hideVisible(){
    if (registerVisible === true)
    {
        hideElement(registerForm);
        registerVisible = false;
    }
    if (loginVisible === true)
    {
        hideElement(loginForm);
        loginVisible = false;
    }
    if (menuPongVisible === true)
    {
        hideElement(menuPongDiv);
        menuPongVisible = false;
    }
    if (statsVisible === true)
    {
        hideElement(statsDiv);
        statsVisible = false;
    }
    if (friendsVisible === true)
    {
        hideElement(friendsDiv);
        friendsVisible = false;
    }
    if (paramsVisible === true)
    {
        hideElement(paramsDiv);
        paramsVisible = false;
    }
    if (matchHistoryBool === true)
    {
        hideElement(matchHistoryDiv);
        matchHistoryBool = false;
    }
    hideElement(goBackButton);
}


function showFriends(){
    console.log("calling showFriends:", friendsDiv);
    console.log("bool:", friendsVisible);
    // const element = document.getElementById("friends_list");
    if (friendsVisible === true)
    {
        console.log("friends should be visible");
        hideElement(goBackButton);
        hideElement(friendsDiv);
        friendsVisible = false;
        return;
    }
    console.log("friends should not be visible");
    showElement(friendsDiv);
    friendsDiv.style.z_index = '2';
    friendsVisible = true;
    showElement(goBackButton);
}

function showParams()
{
    console.log("calling showParams with visible : ", paramsVisible);
    if (paramsVisible === false)
    {
        paramsDiv.style.visibility = 'visible';
        paramsDiv.style.opacity = '1';
        paramsVisible = true;
    }
    else
    {
        paramsDiv.style.visibility = 'hidden';
        paramsDiv.style.opacity = '0';
        paramsVisible = false;
    }
}


var statsVisible = false;
function showStats(){
    console.log("stats:", statsDiv);
    console.log("visible:", statsVisible);
    if (statsVisible === true)
    {
		statsDiv.style.visibility = 'hidden'
		statsVisible = false;
        return;
    }
	else
	{
		console.log(statsDiv);
		statsDiv.style.visibility = 'visible';
		statsDiv.style.opacity = '1';
		statsVisible = true;
		showElement(goBackButton);
	}
}


function showMatchHistory(){
	console.log("Display match history:", matchHistoryDiv);
	console.log("Display match history:", matchHistoryBool);
    if (matchHistoryBool === true)
    {
		console.log("Disabling match history");
		matchHistoryDiv.style.visibility = 'hidden'
		matchHistoryBool = false;
        return;
    }
	else
	{
		console.log("Activating match history");
		matchHistoryDiv.style.visibility = 'visible';
		matchHistoryDiv.style.opacity = '1';
		matchHistoryBool = true;
	}
}

function headerLogoutFunction(){
    console.log("LOGING OUT");
    fetch('/account/logout/', {
        // Resquest type
        method: 'POST',
        // Request header
        headers: {
            // Specifies that the body of the request is JSON
            'Content-Type': 'application/json',
            // Retrieves csrftoken from cookie
            'X-CSRFToken': getCookie('csrftoken') // Ensure you handle CSRF token
        },
        // Sends a empty JSON body as a request (no data needed to be shared)
        body: JSON.stringify({})
    })
    // Parses the JSON repsonse 
    .then(response => response.json())
    // Handles the parsed JSON response
    .then(data => {
        if (data.success) {
            console.log("LOGOUT SUCCES");
            // Handle su     ccessful logout
            isZooming = false;
            isZoomed = false;
            loadContent('/');
            dontClick = true;
        } else {
            console.log("LOGOUT FAIL");
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

 // Function to get the CSRF token
 function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}