console.log("handleRegisterForm script loaded");
document.addEventListener('DOMContentLoaded', function() {

  // Get elements 
  const registerForm = document.getElementById('registerForm');
  const registerError = document.getElementById('registerError');

  // Handle form submission
  if (registerForm != undefined)
  {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        console.log("coucou les sangs");
        const formData = new FormData(this);
        fetch(this.action, {
            method: 'POST',
            body: formData,
            redirect: 'manual' // Prevent automatic redirection
        })
        .then(response => {
          console.log(response)
            if (!response) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the server responds with JSON
        })
        .then(data => {
            // Handle success, redirect or update UI accordingly
            console.log(data);
            console.log("cccccccccccccccccccccccc")
            window.location.href = '/'; // Adjust as needed
        })
        .catch(error => {
            console.log("Error detected");
            // Display error message
            registerError.textContent = 'This username is already taken. Please take an other one <3   ';
        });
    });
    }
});
