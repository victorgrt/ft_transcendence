
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
            notifsDiv.style.zIndex = '2 ';
            console.log("ZINDEX:", notifsDiv.style.z_index);
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
		denyNotification(notif_to_accept);
        loadContent('/pong/' + notif_to_accept.message.session_id + '/');
        return ;
    }
    else if (notif_to_accept.type_of_notification === 'friend')
    {
        console.log("FRIEND");
		console.log("data:", notif_to_accept);
        //logique de ajouter en amis
        try {
			const raw_data = await fetch(`/friends/accept_friend_request/`, {
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
					// alert('Error: ' + response.statusText);
                }
            });
            return;
        }

        // $.ajax({
        //     type: 'POST',
        //     url: '/send-notification/',  // L'URL doit correspondre à celle définie dans urls.py
        //     data: formData,
        //     success: function(response) {
        //         if (response.status === 'success') {
        //             console.log("la mon reuf");
        //             compteur_notifs++;
        //             alert(response.message);
        //         } else {
        //             alert(response.message);
        //         }
        //     },
        //     error: function(response) {
        //         alert('Error: ' + response.statusText);
        //     }
        // });
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
    document.getElementById("notiftable").innerHTML = "";
    while (i < size) {
        console.log("i:", i);
        var type = "default";
        if (notifs_fetched.notifications[i].type_of_notification === 'play')
            type = "play";
        else if (notifs_fetched.notifications[i].type_of_notification === 'friend')
            type = "friend"

        var tr = document.createElement("tr");
        tr.id = notifs_fetched.notifications[i].notification_id;
        tr.classList.add("notifs_tr");
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
        const raw_data = await fetch(`/friends/deny_notification/`, {
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

function reloadNotifs(){
    hideNotifs();
    // document.getElementById("notiftable").innerHTML = "";
    // showNotifs();
    // showElement(notifsDiv);
    showNotifs();
}