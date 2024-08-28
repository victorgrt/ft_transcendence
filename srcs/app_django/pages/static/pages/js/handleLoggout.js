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
