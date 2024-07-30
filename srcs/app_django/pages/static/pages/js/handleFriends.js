

let value = '';
console.log("base:", baseSrc);

var toUser;

document.addEventListener('DOMContentLoaded', () => {

	if (inputSearchFriend) 
	{
		inputSearchFriend.addEventListener('input', handleInput)
	}
}); 

async function handleInput(event)
{
	inputValue = event.target.value;
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
			displayResultBox(inputValue);
			toUser = inputValue;
		}
		else 
		{
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
	console.log("In get_user_data");
	try {
		const raw_data = await fetch(`account/get_user_data/?username=${encodeURIComponent(username)}`, {
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
	username = inputValue;
	console.log("In display_result_box");
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
			resultAvatar.src = friend_data.avatar;
		}
		if (friendExists === false)
		{
			console.log("	user box generated");
			resultBox.style.visibility ='visible';
			resultUsername.textContent = user_data.get_avatar_name;
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
        const response = await fetch('friends/is_friend/', {
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
            console.log("Friend exists");
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
        const response = await fetch('account/is_user/', {
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