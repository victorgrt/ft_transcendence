function loadElementForChange()
{
	settings = document.getElementById('settingsForm');
}

function submitChangeProfile(e)
{
	const form = e.target;
	const formData = new FormData(form);
	const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

	fetch(form.action, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrfToken
		},
		body: formData
	})
	.then(response => response.json())
	.then(data => {
		const messageDiv = document.getElementById('messageDiv');
		if (data.success) {
			messageDiv.innerHTML = '<p>Profile updated successfully!</p>';
			document.getElementById('old_username').innerText = formData.get('new_username') || document.getElementById('old_username').innerText;
			console.log("BEFORE loaded content");
			hideElement(paramsDiv)
			loadContent('/');
		} else {
			messageDiv.innerHTML = `<p>${data.message}</p>`;
		}
	})
	.catch(error => console.error('Error:', error));
}

function loadChangeProfile()
{
	loadElementForChange();
	const settings = document.getElementById("settingsForm");
	if (settings)
	{
		// settings.addEventListener('submit', submitChangeProfile(event));
		settings.addEventListener('submit', function(e) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
	
		fetch(form.action, {
			method: 'POST',
			headers: {
				'X-CSRFToken': csrfToken
			},
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			const messageDiv = document.getElementById('messageDiv');
			if (data.success) {
				messageDiv.innerHTML = '<p>Profile updated successfully!</p>';
				document.getElementById('old_username').innerText = formData.get('new_username') || document.getElementById('old_username').innerText;
				console.log("BEFORE loaded content");
				hideElement(paramsDiv)
				loadContent('/');
			} else {
				messageDiv.innerHTML = `<p>${data.message}</p>`;
			}
		})
		.catch(error => console.error('Error:', error));});
	}
}