
// Ensures that the html page has been fully loaded before listening
document.addEventListener('DOMContentLoaded', function () {
	// Stores the id of the listened button
	const element = document.getElementById('logoutButton');
    if (element) {
	// The function is triggered when the button is clicked
        element.addEventListener('click', function () {
            // Fetch API
				// Sends a request to the backend
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
                    // Handle successful logout
					isZooming = false;
					isZoomed = false;
                    alert(data.message);
                    window.location.href = '/'; // Reload the page or update the UI as needed
					// updateUIForLogout();
                } else {
                    // Handle failure
					console.log("LOGOUT FAIL");
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});

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

function updateUIForLogout() 
{
	console.log("Updating UI for logout");
    const header = document.getElementById('header');
    header.innerHTML = 
	`
        <button class="needed_hover" onclick='goToLogin()' src="{% static '/js/main.js' %}">LOGIN</button>
        <button class="needed_hover" onclick='goToRegister()' src="{% static '/js/main.js' %}">REGISTER</button>
    `
	;
}