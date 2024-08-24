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
    if (friendsVisible === true)
    {
        console.log("friends should be visible");
        hideElement(goBackButton);
        hideElement(friendsDiv);
        friendsVisible = false;
        return;
    }
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


console.log("Defined showStats");
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
