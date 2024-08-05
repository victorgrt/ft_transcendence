console.log("handleLoginForm script loaded");
document.addEventListener('DOMContentLoaded', handleLoginForm);
document.getElementById('content').addEventListener('DOMContentLoaded', handleLoginForm);

function handleLoginForm() {

	// Get elements 
	const loginForm = document.getElementById('loginForm');
	const loginError = document.getElementById('loginError');
  
	// Handle form submission
	if (loginForm != undefined)
	{
	  loginForm.addEventListener('submit', function(e) {
		  e.preventDefault(); // Prevent default form submission
	
		  const formData = new FormData(this);
		  fetch(this.action, {
			  method: 'POST',
			  body: formData,
			  redirect: 'manual' // Prevent automatic redirection
		  })
		  .then(response => {
			console.log(response)
			  if (!response.ok) {
				  throw new Error('Network response was not ok');
			  }
			  return response.json(); // Assuming the server responds with JSON
		  })
		  .then(data => {
			console.log(data);
			isZooming = false;
			isZoomed = true;
			loadContent("/");
		  })
		  .catch(error => {
			  console.error('There was a problem with the fetch operation:', error);
			  
			  // Display error message
			  loginError.textContent = 'Invalid credentials. Please try again.';
		  });
	  });
	}
}