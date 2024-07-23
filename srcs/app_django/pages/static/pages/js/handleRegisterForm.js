document.addEventListener('DOMContentLoaded', function ()
{
	const form = document.getElementById('register')
	const registerError = document.getElementById('registerError');
	if (form)
	{
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
			})
			.then(response => response.json())
			.then(data => 
			{
				if (data.success) 
				{
					// Handle successful registration
					console.log("Registration successful");
					// alert(data.message);
					window.location.href = '/';
				} 
				else 
				{
					// Handle registration failure
					console.log("Registration failed");
					alert(data.message);
				}
			})
			.catch(error => 
			{
				console.error('Error:', error);
				alert('An error occurred during registration.');
				registerError.textContent = 'This username is already taken. Please take an other one <3   ';
			});

		});
	}
});

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