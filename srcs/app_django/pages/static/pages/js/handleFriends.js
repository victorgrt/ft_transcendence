

let value = '';
console.log("base:", baseSrc);



document.addEventListener('DOMContentLoaded', () => {

	if (inputSearchFriend) 
	{
		inputSearchFriend.addEventListener('input', handleInput)
	}
}); 

async function handleInput(event)
{
	var inputValue = event.target.value;
	console.log("INPUTVALUE:", inputValue);
	friendsList.style.visibility = 'hidden';
	if (inputValue !== "") 
	{
		// console.log(inputValue);
		const userExists = await isUser(inputValue);
		console.log("Is user input: '", inputValue, "'");
		if (userExists)
		{
			console.log("isUser was successful");
			searchFriendError.style.visibility = 'hidden';
			toUser = inputValue;
			displayResultBox(inputValue);
		}
		else 
		{
			console.log("USER DOES NOT EXIST")
			searchFriendError.textContent = 'No user or friend found';
			searchFriendError.style.visibility = 'visible';
			resultBox.style.visibility = 'hidden';
			addButton.style.visibility = 'hidden';
			return;		
		}
	}
	else
	{
		console.log("Friend list generated");
		friendsList.style.visibility = 'visible';
	}
	console.log("End of handleInput");
	return ;
}



async function getUserData(username) {
	console.log("In get_user_data 2222make re");
	try {
		const raw_data = await fetch(`/account/get_user_data/?username=${encodeURIComponent(username)}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Include CSRF token if needed, but it's not usually required for GET requests
			// 'X-CSRFToken': getCookie('csrftoken') 
		}
		})
		const data = await raw_data.json();
		if (data.success) {
			console.log("	User data:", data);
			console.log("	Data successfuly returned from backend");
			return data;  // Function to display user data
		} else {
			console.log(data.message);
			return null; // Return null or handle error
		}

	}
	catch (error) {
		console.error('	Error:', error);
		return null; // Return null or handle error
	}
}

async function displayResultBox(inputValue)
{
	console.log("DISPLAYING RESULT BOX", inputValue);
	username = inputValue;
	console.log("In display_result_box : ");
	resultBox.style.visibility ='visible';
	resultBox.style.opacity = '1';
	const user_data = await getUserData(username);
	console.log("	user data: ", user_data);
	const friendExists = await isFriend(inputValue);
	if (user_data)	
	{	
		if (user_data.is_active === true)
		{
			resultStatus.style.backgroundColor = 'green';
		}
		else
		{
			resultStatus.style.backgroundColor = 'red';
			resultUsername.textContent = user_data.username;
			console.log("HERE :", user_data.username);
			resultAvatar.src = friend_data.avatar;
		}
		if (friendExists === false)
		{
			console.log("	user box generated");
			resultBox.style.visibility ='visible';
			resultUsername.style.color = 'white';
			resultUsername.textContent = user_data.username;
			var tmpSrc = baseSrc + user_data.avatar;
			resultAvatar.src = tmpSrc;
			addButton.style.visibility = 'visible';
			addButton.style.opacity = '1';
		}
		else
		{
			console.log("	friend box generated");
			resultBox.visibility ='visible';
			resultUsername.textContent = user_data.get_avatar_name;
			var tmpSrc = baseSrc + user_data.avatar;
			resultAvatar.src = tmpSrc;
			addButton.style.visibility = 'hidden';
		}
	}	
		return ;
}

async function isFriend(inputValue) {
	console.log("In isFriend");
	console.log('	Input value:', inputValue);
    try {
        const response = await fetch('/friends/is_friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Ensure you handle CSRF token
            },
            body: JSON.stringify({
                'friend_name': inputValue
            })
        });
        const data = await response.json();
        if (data.success) {
            console.log("	Friend exists");
            return true;
        } else {
            console.log("	Friend does not exist");
            return false;
        }
    } catch (error) {
        console.error('	Error:', error);
        return false;
    }
}

async function sendFriendRequest() {
    try {
        const response = await fetch('friends/send_friend_request/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Ensure you handle CSRF token
            },
            body: JSON.stringify({
                'friend_name': toUser,
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log("Friend request sent");
			hideElement(friendsBox);
			document.getElementById("input_search_friend").value = "";
			return true;
        } else {
            console.log("Friend does not exist");
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function isUser(inputValue) {
    try {
        const response = await fetch('/account/is_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Ensure you handle CSRF token
            },
            body: JSON.stringify({
                'username': inputValue
            })
        });
        const data = await response.json();
        
        if (data.success) {
            console.log("User exists and returned true");
            return true;
        } else {
            console.log("User does not exist");
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false; // Handle the error and return a default value
    }
}

// function getUserData(username) {
//     fetch(`account/get_user_data/?username=${encodeURIComponent(username)}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             // Include CSRF token if needed, but it's not usually required for GET requests
//             // 'X-CSRFToken': getCookie('csrftoken') 
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             console.log("User data:", data);
// 			return data;  // Function to display user data
//         } else {
//             console.log(data.error);
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }


function friendRequest()
{
	console.log("Friend request");
}

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


function friendSendChallenge(friend_username){
	console.log(friend_username);
	if (friend_username === 'null')
	{
		friend_username = resultUsername.textContent;	
	}
	console.log(friend_username);
	var formData = {
		'pseudo': friend_username,
		'notification_type': 'play with',
		'from_user': $('#current_username').text(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
	};
	console.log("formData:", formData);
	if (formData.notification_type === "" || formData.pseudo === "")
	{
		console.log("EMPTY ????");
		return ;
	}

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
}

async function reloadFriendBox(){
	friends_list = await fetchUserFriends();
	console.log("friends list : ", friends_list);
	console.log("under:", friends_list.friends[0]);
	let i = 0;
	let size = Object.keys(friends_list.friends).length;
	console.log("size:", size);
	friendsList.innerHTML = "";
	while (i < size)
	{
		displayResultBoxFromObject(friends_list.friends[i]);
		i++;	
	}
}

async function fetchUserFriends() {
    try {
        const response = await fetch('/friends/get_user_friends/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
            console.log('User friends:', data.friends);
			return (data);
        } else {
            console.log('Failed to fetch friends:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function displayResultBoxFromObject(friend) {
    console.log("displaying new friend : ", friend);
	document.getElementById('friends_list').style.visibility = "visible";
	if (friend) {
        // Create the main container
        const new_box = document.createElement('div');
        new_box.className = 'friend_box';
        new_box.id = 'result_box';

        // Create the status circle
        const statusCircle = document.createElement('div');
        statusCircle.className = 'status_circle';
        statusCircle.style.backgroundColor = friend.is_online ? 'green' : 'red';
        new_box.appendChild(statusCircle);

        // Create the avatar image
        const avatar = document.createElement('img');
        avatar.id = 'friend_avatar';
		const regex = /img_avatars\/([^\/]+\.[^\/]+)$/;
		const match = `${friend.avatar}`.match(regex);
		const imageName = match ? match[1] : null;
		console.log("here:", imageName);
		if (imageName === null)
			imageName = "default_avatar.jpg"
        avatar.src = `/staticfiles/pages/img_avatars/` + imageName;
		new_box.appendChild(avatar);

        // Create the username paragraph
        const username = document.createElement('p');
        username.id = 'friend_username';
        username.textContent = friend.username;
        new_box.appendChild(username);

        // Create the friend buttons container
        const friendButtons = document.createElement('div');
        friendButtons.className = 'friend_buttons';

        // Create the send challenge button
        const sendButton = document.createElement('button');
        sendButton.id = 'sendbtn';
        sendButton.className = 'needed_hover';
        sendButton.onclick = function() { friendSendChallenge(friend.username); };

        // Create the send challenge button image
        const sendButtonImage = document.createElement('img');
        sendButtonImage.id = 'friends_challenge';
        sendButtonImage.src = '/staticfiles/pages/images/challenge.png';
        sendButton.appendChild(sendButtonImage);

        // Append the send challenge button to the buttons container
        friendButtons.appendChild(sendButton);
        new_box.appendChild(friendButtons);

        // Append the friend box to the main container (assuming you have a container with ID 'friendsContainer')
        document.getElementById('friends_list').appendChild(new_box);
		console.log("end displaying new friend");
	}
}