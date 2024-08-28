document.addEventListener('DOMContentLoaded', handleRegisterForm);
document.getElementById('content').addEventListener('DOMContentLoaded', handleRegisterForm);


function handleRegisterForm()
{
	const form = document.getElementById('registerForm')
	const registerError = document.getElementById('registerError');
	if (form)
	{
		console.log("in register_form"),
		form.addEventListener('submit', function (event)
		{
			event.preventDefault();
			// Create a FormData object from the form element
			const formData = new FormData(this);
			fetch(form.action,
			{
				method: 'POST',
				headers: 
				{
					'X-CSRFToken': getCookie('csrftoken')
				},
				body: formData,
				redirect: 'manual'
			})
			.then(response => response.json())
			.then(data => 
			{
				console.log("data message:", data.message);
				if (data.message !== 'Registered successfully')
				{
					registerError.textContent = data.message;
					return ;
				}
				else
				{
					// loadContent('/');
					goToLogin();
				}
			})
			.catch(error => 
			{
				//WE NEVER GO HERE BRUHHHHHHHHhh
				console.error('Error:', error);
				alert('An error occurred during registration.');
				registerError.textContent = 'This username is already taken. Please take an other one <3   ';
			});

		});
	}
}