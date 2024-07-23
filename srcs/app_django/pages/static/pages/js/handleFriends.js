function goToFriends() {
    if (isZooming) return;
	console.log("Going to friends feature");
    const clickCoordinates = new THREE.Vector3(2.224749245944513, 2.670698308531501, -2.3195560957531383); // Remplacez x, y, z par les coordonnées de l'objet

    selecting_clickable = true;
    selected_object_name = "Plane009_2";
    zoomToCoordinates(clickCoordinates, 0);
	if (document.readyState === 'loading') {  
		// Loading not complete
        console.log("document not ready");
		document.addEventListener('DOMContentLoaded', updateUIForFriends);
    } else {  // DOMContentLoaded has already fired
        console.log("document ready");
        updateUIForFriends();
    }
    // updateUIForFriends();
}

function updateUIForFriends()
{
	console.log("Updating UI for friends feature");

	
	const friendsDiv = document.getElementById('friends');
	if (friendsDiv) {
	console.log("injecting friends html");
	friendsDiv.style.display = 'block';
	friendsDiv.style.visibility = 'visible';
	friendsDiv.innerHTML =
	`
		<p style="color: white;">HEELLLO WOOOOOOOOOOOOOOOOOOOOOOOORRRRRRRRRRRRLLLLLLLLLLLDD<p>
	`;
	} 
	else {
		console.log("friends div not found");
	}
}