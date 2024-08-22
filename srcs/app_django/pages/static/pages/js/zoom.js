async function zoomTo(targetPosition, lookAtCoordinates, onCompleteActions) {
	console.log("inside zoom to");
    if (!isZooming) {
        isZooming = true;
        hideEverything();
        hideElement(header);
        const notifbtn = document.getElementById("notifbtn");
        hideElement(notifbtn);

        new TWEEN.Tween(camera.position)
            .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                controls.target.x = lookAtCoordinates.x;
                controls.target.y = lookAtCoordinates.y;
                controls.target.z = lookAtCoordinates.z;
            })
            .onComplete(() => {
                isZooming = false;
                isZoomed = true;
                showElement(goBackButton);
                if (typeof onCompleteActions === 'function') {
                    onCompleteActions();
                }
            })
            .start();
    }
}

function zoomBack() {
	hideEverything();
	const initialLook = new THREE.Vector3(0, 0, 0); // Point vers lequel la caméra regarde initialement
    const targetPosition = initialCameraPosition;

	if (isZoomed === true || couchZoomed === true || loaded === true)
	{
		new TWEEN.Tween(camera.position)
		.to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(() => {
			controls.target.x = initialLook.x;
			controls.target.y = initialLook.y;
			controls.target.z = initialLook.z;
		})
		.onComplete(() => {
			isZooming = false;
			isZoomed = false;
            showElement(header);
		})
		.start();
	}
}

var couchZoomed = false;

function zoomToArcade() {
    zoomTo(
		new THREE.Vector3(1, 4, 4),
		new THREE.Vector3(-20, 4, 0),
        () => {
			showElement(menuPongDiv);
			
		}
    );
	hideEverything();
	loadMenuPong();
	menuPongVisible = true;
	dontClick = true;
}

function varCouch()
{
	isZoomed = false;
	couchZoomed = true;
	console.log("couch:", couchZoomed);
}

function zoomToCouch() {
    zoomTo(
        new THREE.Vector3(10, 2.5, 2), 
        new THREE.Vector3(initialCameraLookAt.x, initialCameraLookAt.y + 2, initialCameraLookAt.z - 1.5),
        () => {
			varCouch();
		}
    );
}

function zoomToPC() {
    const targetPosition = new THREE.Vector3(2, 2.8, 0.02);
    const hardClickCoordinates = new THREE.Vector3(1.8, 2.8, -2.3);

    zoomTo(
        targetPosition,
        hardClickCoordinates,
        () => {
			loginVisible = true;
			showElement(loginForm);

			registerVisible = true;
			showElement(registerForm);
		}
    );
}


function zoomToPCWhileLogged() {
    const targetPosition = new THREE.Vector3(2, 2.8, 0.02);
    const hardClickCoordinates = new THREE.Vector3(1.8, 2.8, -2.3);
    zoomTo(
        targetPosition,
        hardClickCoordinates,
        () => {
			showElement(friendsDiv);
			showMatchHistory();
		}
    );
	friendsVisible = true;
}

function zoomToDoor() {
    console.log(isZoomed, " ", isZooming);
    if (!isZoomed && !isZooming)
    {
        isZooming = true;
        var targetPosition = new THREE.Vector3(7, 4, 0);
        hideEverything();
        hideElement(header);
        const notifbtn = document.getElementById("notifbtn");
        hideElement(notifbtn);
        isZooming = false;
        isZoomed = false;
        zoomTo(
            targetPosition,
            targetPosition,
            () => {
                zoomBack(); 
            }
            );
        }
        // setTimeout(3000)
        isZoomed = false;
        isZooming = false;

}