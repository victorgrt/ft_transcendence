console.log("main script is loaded")

var loginVisible;
var registerVisible;
var menuPongVisible;
var notifsVisible = false;
var paramsVisible = false;
var statsVisible = false;
var friendsVisible = false;

var isZoomed = localStorage.getItem('isZoomed') === 'true'; // Pour suivre l'état de zoom;
var isZooming = false;

const initialCameraPosition = new THREE.Vector3(12, 5, 12); // Position initiale de la caméra
const initialCameraLookAt = new THREE.Vector3(0, 0, 0); // Point vers lequel la caméra regarde initialement
const duration = 2000; //Duree du zoom

//=== ZOOM INTO OBJECTS ===//
function zoomToCoordinates(clickCoordinates) {
    var targetPosition;
    if (isZoomed && selecting_clickable === true) {
        if (loginVisible === true || registerVisible === true)
            return ;
        console.log("HERE BABYBOY")
        isZooming = true;
        if (loginVisible === true)
            hideElement(loginForm);
        else if (registerVisible === true)
            hideElement(registerForm);
        hideElement(goBackButton);
        new TWEEN.Tween(camera.position)
            .to({ x: initialCameraPosition.x, y: initialCameraPosition.y, z: initialCameraPosition.z }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                controls.target = clickCoordinates;

            })
            .onComplete(() => {
                if (loginVisible || registerVisible)
                {
                    hideElement(loginForm);
                    hideElement(registerForm);
                }
                isZoomed = false;
                isZooming = false;
                localStorage.setItem('isZoomed', isZoomed);
                // camera.position.set = initialCameraPosition;
                // camera.lookAt = initialCameraLookAt;
            })
            .start();
    }
    else if (!isZoomed && selecting_clickable == true && isZooming == false) {
        isZooming = true;
        isZoomed = true;
        console.log("isZoomed : ", isZoomed);
        const zoomDistance = 2; // Zoom distance relative to the object (adjust as needed)
        const direction = new THREE.Vector3();
        direction.subVectors(clickCoordinates, camera.position).normalize();
        if (selected_object_name == "computerScreen_2_1") {
            console.log("click :", clickCoordinates);
            targetPosition = new THREE.Vector3(2, 2.8, 0.02);
            new TWEEN.Tween(camera.position)
                .to({ x: targetPosition.x, y: targetPosition.y, z: -targetPosition.z }, duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    controls.target.x = clickCoordinates.x;
                    controls.target.y = clickCoordinates.y;
                    controls.target.z = clickCoordinates.z;
                })
                .onComplete(() => {
                    console.log("coord: x", targetPosition.x, "y:", targetPosition.y, "z:", targetPosition.z)
                    isZooming = false;

                    controls.target.x = clickCoordinates.x;
                    controls.target.y = clickCoordinates.y;
                    controls.target.z = clickCoordinates.z;

                    // loginVisible.removeProperty('position');
                    console.log(loginForm);
                    if (loginForm != undefined)
                    {
                        loginForm.style.visibility = 'visible';
                        loginForm.style.opacity = '1';
                        loginForm.style.width = '40%';
                        loginForm.style.position = 'relative';
                        loginVisible = true;
                    }
                    if (registerForm != undefined)
                    {
                        registerForm.style.visibility = 'visible';
                        registerForm.style.opacity ='1';
                        registerForm.style.width = '40%';
                        registerForm.style.position = 'relative';
                        registerVisible = true
                    }
                    showElement(goBackButton);
                })
                .start();
        }
        else if (selected_object_name == "GameScreen_Plane") {
            targetPosition = new THREE.Vector3(1.75, 3.7, 2.5);
            new TWEEN.Tween(camera.position)
                .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    camera.lookAt(-targetPosition.x, targetPosition.y, targetPosition.z);
                })
                .onComplete(() => {
                    console.log("coord: x", targetPosition.x, "y:", targetPosition.y, "z:", targetPosition.z)
                    isZooming = false;
                    controls.target.x = -targetPosition.x;
                    controls.target.y = targetPosition.y;
                    controls.target.z = targetPosition.z;
                    menuPongVisible = true;
                    showElement(menuPongDiv);
                    loadMenuPong();
                    hideElement(header);
                    showElement(goBackButton);
                })
                .start();
        }
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
    // showElement(goBackButton);
}

function zoomToPC() {

    var clickCoordinates = new THREE.Vector3(2.224749245944513, 2.670698308531501, -2.3195560957531383); // Remplacez x, y, z par les coordonnées de l'objet
    isZooming = true;
    isZoomed = true;
    //position we want to be
    targetPosition = new THREE.Vector3(2, 2.8, 0.02);
    //position we want to look at
    hardClickCoordinates = new THREE.Vector3(1.8, 2.8, -2.3);
    new TWEEN.Tween(camera.position)
        .to({ x: targetPosition.x, y: targetPosition.y, z: -targetPosition.z }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            controls.target.x = hardClickCoordinates.x;
            controls.target.y = hardClickCoordinates.y;
            controls.target.z = hardClickCoordinates.z;
        })
    .onComplete(() => {
        console.log("coord: x", targetPosition.x, "y:", targetPosition.y, "z:", targetPosition.z)
        isZooming = false;
        controls.target.x = hardClickCoordinates.x;
        controls.target.y = hardClickCoordinates.y;
        controls.target.z = hardClickCoordinates.z;
        showElement(goBackButton);
    })
    .start();
}

function centerRegisterForm()
{

    contentdiv.style.display = 'flex';
    contentdiv.style.justify_content = 'center';
    contentdiv.style.align_items = 'center';

    registerForm.style.width = '80%';
    // registerForm.style.position = 'absolute';

    loginForm.style.position = 'absolute';
}


function centerLoginForm()
{
    contentdiv.style.display = 'flex';
    contentdiv.style.justify_content = 'center';
    contentdiv.style.align_items = 'center';

    loginForm.style.width = '50%';
    loginForm.style.height = '40%';

    registerForm.style.position = 'absolute';
}

function showHideElement(element)
{
	console.log("in showHideElement");
	if (element.style.visibility === 'visible')
	{	
		element.style.visibility = 'hidden';
		element.style.opacity = '0';
	}
	else
	{	
		element.style.visibility = 'visible';
		element.style.opacity = '1';
	}
}

function showElement(element)
{
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    element.style.z_index = '2';
}

function hideElement(element) {
    if (element.classList.contains("register_form"))
        registerVisible = true;
    if (element.classList.contains("login_form"))
        loginVisible = true;
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    element.style.z_index = '-2';
    console.log("z_index assigne :", element.style.z_index);
}

// SEEMS LIKE NOT NEEDED BUT KEEP IT HERE JUST IN CASE
function resetStyleForms(){
    // RESET register form style
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

function zoomBack() {
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
    hideElement(goBackButton);
    if (isZoomed === false)
        return; //returns because no zoom back needed

    isZooming = true;
    new TWEEN.Tween(camera.position)
        .to({ x: initialCameraPosition.x, y: initialCameraPosition.y, z: initialCameraPosition.z }, duration)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(() => {
            if (clickCoordinates != null)
            {
                controls.target.x = clickCoordinates.x;
                controls.target.y = clickCoordinates.y;
                controls.target.z = clickCoordinates.z;
            }
            else
            {
                controls.target.x = initialCameraLookAt.x;
                controls.target.y = initialCameraLookAt.y;
                controls.target.z = initialCameraLookAt.z;
            }
        })
        .onComplete(() => {
            isZoomed = false;
            isZooming = false;
            localStorage.setItem('isZoomed', isZoomed);
            controls.position = new THREE.Vector3(12, 5, 12);
            controls.target.x = initialCameraLookAt.x;
            controls.target.y = initialCameraLookAt.y;
            controls.target.z = initialCameraLookAt.z;
            showElement(header);
        })
        .start();
}


// SHOW ELEMENT //
function showStats(){
    if (statsVisible === true)
    {
        hideElement(statsDiv);
        statsVisible = false;
        return ;
    }
    showElement(statsDiv);
    // statsDiv.style.visibility = 'visible';
    // statsDiv.style.opacity = '1';
    // statsDiv.style.z_index = '2';
    statsVisible = true;
}

function showFriends(){
    const element = document.getElementById("friends_list");
    if (friendsVisible === true)
    {
        hideElement(goBackButton);
        friendsDiv.style.visibility = '0';
        friendsDiv.style.opacity = '0';
        friendsDiv.style.z_index = '-2';
        element.style.z_index = '-2';
        friendsVisible = false;
        return;
    }
    showElement(friendsDiv);
    element.style.z_index = '2';
    // friendsDiv.style.z_index = '2';
    // friendsDiv.style.visibility = 'visible';
    // friendsDiv.style.opacity = '1';
    friendsVisible = true;
}

function showParams()
{
    if (paramsVisible === true)
    {
        hideElement(goBackButton)
        paramsDiv.style.visibility = '0';
        paramsDiv.style.opacity = '0';
        paramsDiv.style.z_index = '-2';
        paramsVisible = false;
        return;
    }
    showElement(paramsDiv);
    // paramsDiv.style.z_index = '2';
    // paramsDiv.style.visibility = 'visible';
    // paramsDiv.style.opacity = '1';
    paramsVisible = true;
}

async function showNotifs() {
    try {
        const response = await fetch('/account/get_user_notifications/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        notifs_fetched = await response.json();
        if (notifs_fetched.success) {
            console.log("MESSAGE:", notifs_fetched.message);
            const notifbtn = document.getElementById("notifbtn");
            hideElement(notifbtn);
            showElement(notifsDiv);
            notifsVisible = true;
            handleNotification();
        } else {
            console.log('Failed to fetch notifications:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// HANDLE NOTIFICATIONS
async function acceptNotif(id){
    notif_to_accept = getNotificationById(id);
    console.log("accepting:", notif_to_accept);
    if (notif_to_accept.type_of_notification === 'play')
    {
        console.log("PLAY on session:", notif_to_accept.message.session_id);
        loadContent('/pong/' + notif_to_accept.message.session_id + '/');
        removeNotificationFromDom(notif_to_accept.notification_id);
        return ;
    }
    else if (notif_to_accept.type_of_notification === 'friend')
    {
        console.log("FRIEND");
		console.log("data:", notif_to_accept);
        //logique de ajouter en amis
        try {
			const raw_data = await fetch(`friends/accept_friend_request/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
                'data': notif_to_accept
            	})
			});
			const received_data = await raw_data.json();
			if (received_data.success) {
				console.log("User data:", received_data);
				console.log("Data successfuly returned from backend");
				console.log("APPENED EVERYTHING")
                //REMOVE THE WHOLE RAW THAT WAS ACCEPTED   
                removeNotificationFromDom(id);            
				return received_data; 
			} else {
				console.log(notif_to_accept.message);
				return null; // Return null or handle error
			}
	
		}
		catch (error) {
			console.error('Error:', error);
			return null; // Return null or handle error
		}
    }
    else
    {
        denyNotification(notif_to_accept);
    }
}


function declineNotif(id_del){
    var notif_to_deny = getNotificationById(id_del);
    console.log("trying to deny :",notif_to_deny);
    denyNotification(notif_to_deny);
}

function hideNotifs(){
    console.log("closing notifications div")
    notifsDiv.style.visibility = 'hidden';
    notifsDiv.style.opacity = '0';
    showElement(notifbtn);
}


$(document).ready(function() {
    console.log("on passe ici?");
    $('#sendbtn').click(function(e) {
        e.preventDefault();  // Empêche le formulaire de se soumettre normalement
        
        var formData = {
            'pseudo': $('#inputnotif').val(),
            'notification_type': $('#selectnotif').val(),
            'from_user': $('#from_user').text(),
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
        };

        if (formData.notification_type === "" || formData.pseudo === "")
        {
            console.log("EMPTY ????");
            return ;
        }

        // If type is play with, send request to join game
        if (formData.notification_type === "play with")
        {
            console.log("PLAY WITH");
            $.ajax({
                type: 'POST',
                url: '/send_play_request/',  // L'URL doit correspondre à celle définie dans urls.py
                data: {
                    'to_username': formData.pseudo,
                },
                headers: {
                    'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
                }
                ,
                success: function(response) {
                    console.log(response);
                    compteur_notifs++;
                    loadContent('/pong/' + response.session_id + '/');
                },
                error: function(response) {
                    alert('Error: ' + response.statusText);
                }
            });
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/send-notification/',  // L'URL doit correspondre à celle définie dans urls.py
            data: formData,
            success: function(response) {
                if (response.status === 'success') {
                    console.log("la mon reuf");
                    compteur_notifs++;
                    alert(response.message);
                } else {
                    alert(response.message);
                }
            },
            error: function(response) {
                alert('Error: ' + response.statusText);
            }
        });
    });
});

function showToast(data){
  console.log("data:", data);
  const toastEl = document.createElement('div');
  toastEl.className = 'toast';
  toastEl.role = 'alert';
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.dataset.bsAutohide = 'false';

  // Toast header
  const toastHeader = document.createElement('div');
  toastHeader.className = 'toast-header text-white bg-dark bg-gradient';
  const strongEl = document.createElement('strong');
  strongEl.className = 'me-auto';
  strongEl.textContent = 'FT_TRANSCENDENCE';
  toastHeader.appendChild(strongEl);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.dataset.bsDismiss = 'toast';
  closeButton.setAttribute('aria-label', 'Close');
  toastHeader.appendChild(closeButton);

  // Toast body
  const sender = data.from_user;
  const toastBody = document.createElement('div');
  toastBody.className = 'toast-body text-white bg-secondary bg-gradient';
  toastBody.innerHTML += 'You have got a notification from ' + sender + '!' +
      '<div class="mt-2 pt-2 border-top">\
          <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="toast" onclick="showNotifs()">Show</button>\
          <button type="button" class="btn btn-danger btn-sm" data-bs-dismiss="toast">Close</button>\
      </div>';

  toastEl.appendChild(toastHeader);
  toastEl.appendChild(toastBody);

  // Prepend the toast to the container and show it
  document.querySelector('.toast-container').prepend(toastEl);
  const toastInstance = new bootstrap.Toast(toastEl);
  toastInstance.show(); 
}

async function handleNotification() {
    console.log("notifications_fetched:", notifs_fetched);
    var size = notifs_fetched.notifications.length;
    console.log("SIZE : ", size);
    var i = 0;
    while (i < size) {
        console.log("i:", i);
        var type = "default";
        if (notifs_fetched.notifications[i].type_of_notification === 'play')
            type = "play";
        else if (notifs_fetched.notifications[i].type_of_notification === 'friend')
            type = "friend"

        var tr = document.createElement("tr");
        tr.id = notifs_fetched.notifications[i].notification_id;

        // Create 'from user' data cell
        var tdFromUser = document.createElement("td");
        tdFromUser.id = "notiftd_from_notif";
        tdFromUser.textContent = notifs_fetched.notifications[i].from_user_username;

        // Create 'type' data cell
        var tdType = document.createElement("td");
        tdType.id = "notiftd_type";
        tdType.textContent = type;

        // Create 'accept' button cell
        var tdAccept = document.createElement("td");
        tdAccept.id = "notiftd_from_notif";
        var acceptButton = document.createElement("button");
        acceptButton.className = compteur_notifs;
        acceptButton.id = "notifaccept";
        acceptButton.value = type;
        acceptButton.textContent = "V";
        
        // Using IIFE to create a new scope for each button
        (function(id) {
            acceptButton.onclick = function() { acceptNotif(id); };
        })(notifs_fetched.notifications[i].notification_id);

        tdAccept.appendChild(acceptButton);

        // Create 'decline' button cell
        var tdDecline = document.createElement("td");
        tdDecline.id = "notiftd_from_notif";
        var declineButton = document.createElement("button");
        declineButton.className = compteur_notifs;
        declineButton.id = "notifdecline";
        declineButton.textContent = "X";
        
        // Using IIFE to create a new scope for each button
        (function(id) {
            declineButton.onclick = function() { declineNotif(id); };
        })(notifs_fetched.notifications[i].notification_id);

        tdDecline.appendChild(declineButton);

        // Append cells to row
        tr.appendChild(tdFromUser);
        tr.appendChild(tdType);
        tr.appendChild(tdAccept);
        tr.appendChild(tdDecline);

        // Append row to table
        document.getElementById("notiftable").appendChild(tr);
        i++;
    }
}

function getNotificationById(notificationId) {
    return notifs_fetched.notifications.find(notification => notification.notification_id === notificationId);
}

function removeNotificationFromDom(id_del)
{
    const row = document.getElementById(id_del);
    if (row) {
        console.log("HERE");
        console.log("deleting row of id :", id_del);
        row.remove();
    }
}

async function denyNotification(notif_to_deny){
    try {
        const raw_data = await fetch(`friends/deny_notification/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'data': notif_to_deny
            })
        });
        const received_data = await raw_data.json();
        if (received_data.success)
        {
            console.log("deleting : ", notif_to_deny);
            removeNotificationFromDom(notif_to_deny.notification_id);
        }
    }
    catch (error) {
        console.error('Error:', error);
        return null; // Return null or handle error
    }
}
