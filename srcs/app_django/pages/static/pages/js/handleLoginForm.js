console.log("handleLoginForm script loaded");
document.addEventListener('DOMContentLoaded', function() {

  // Get elements 
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  // Handle form submission
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent default form submission

      const formData = new FormData(this);
      fetch(this.action, {
          method: 'POST',
          body: formData,
          redirect: 'manual' // Prevent automatic redirection
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // Assuming the server responds with JSON
      })
      .then(data => {
          // Handle success, redirect or update UI accordingly
          console.log(data);
          // window.location.href = '/path-to-redirect-after-success'; // Adjust as needed
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);


          // Display error message
          loginError.textContent = 'Invalid credentials. Please try again.';
      });
  });
});