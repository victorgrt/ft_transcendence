var scene, camera, renderer, loader, controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var highlightedObject = null;
var selected_object_name;
var selecting_clickable;

function init() {
    scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(12,5,12);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
    renderer.outpuEncoding = THREE.RGBEEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.25;
    document.body.appendChild(renderer.domElement);
    var light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);

    loader = new THREE.GLTFLoader();
    const sceneurl = "/static/js/scene-18.gltf";
	
    loader.load(
        sceneurl,
        function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh && child.name === 'Plane003_3') {
					// Réinitialiser les propriétés d'émission du matériau spécifique
					child.material.emissive = new THREE.Color(0xED7F10); // Noir pour désactiver l'émission
					child.material.emissiveIntensity = 1; // Aucune intensité d'émission
					child.material.toneMapped = false; // Aucune intensité d'émission
				}
				gltf.scene.traverse(function (child) {
				if (child.isLight) {
					// Si l'objet est une lumière, ajustez ses propriétés
					if (child instanceof THREE.DirectionalLight) {
						child.intensity = 0.5; // Exemple: Réduire l'intensité d'une lumière directionnelle
					} else if (child instanceof THREE.PointLight) {
						child.intensity = 0.3; // Exemple: Réduire l'intensité d'une lumière ponctuelle
					}
		
					if (child instanceof THREE.AmbientLight) {
						// Si l'objet est une lumière ambiante, ajustez ses propriétés
						child.intensity = 0.7; // Exemple: Réduire l'intensité de la lumière ambiante
					}
				}
            });
            });
            scene.add(gltf.scene);

        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% chargé');
        },
        function (error) {
            console.error('Erreur lors du chargement du modèle glTF', error);
        }
    );
    console.log("charged ouais la zone");
    window.addEventListener('click', onClickScene);
	document.addEventListener('mousemove', onMouseMove, false);
    animate();
}

function onMouseMove(event) {
    // Mettre à jour la position du pointeur de la souris
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le rayon de projection pour la souris
    raycaster.setFromCamera(mouse, camera);

    // Trouver les intersections avec les objets de la scène
    var intersects = raycaster.intersectObjects(scene.children, true);
    // Réinitialiser l'objet surligné précédent
    if (highlightedObject) {
        highlightedObject.material.emissiveIntensity = 1; // Réinitialiser l'intensité d'émission
        highlightedObject = null;
    }
    // Mettre en surbrillance l'objet spécifique
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        var selectedObject = intersects.find(function (intersect) {
            // Check si l'utilisteur est sur un objet cliquable
            if ((intersect.object.name === 'Plane003_2' || intersect.object.name === 'Plane009_2') && isZooming === false)
            {
                selected_object_name = intersect.object.name;
                return intersect.object.name;
            }
        });
        
        if (selectedObject) {
            selecting_clickable = true;
            var objectToHighlight = selectedObject.object;
            //ARCADE MACHINE
            if (selectedObject.object.name === 'Plane003_2')
                objectToHighlight.material.emissiveIntensity = 100; // Exemple: intensité d'émission pour la surbrillance
            //ECRAN ORDINATEUR
            else if (selectedObject.object.name === 'Plane009_2')
            {
                objectToHighlight.material.emissiveIntensity = 5; // Exemple: intensité d'émission pour la surbrillance
            }
            // Autres ajustements de surbrillance si nécessaire
            highlightedObject = objectToHighlight;
        }
        else if (!selectedObject)
        {
            selecting_clickable = false;
            document.body.style.cursor = 'default';
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) {
        controls.update(); // Mettre à jour les contrôles OrbitControls à chaque frame
    }
    TWEEN.update(); // Mise à jour de TWEEN
    renderer.render(scene, camera);
}

init();

//=== LAUNCH SCRIPT ===//
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onload = function() {
        if (callback) callback();
    };
    document.head.appendChild(script);
}

//=== RESIZE WINDOW ===//
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

//=== ZOOM INTO OBJECTS ===//
let isZoomed = localStorage.getItem('isZoomed') === 'true'; // Pour suivre l'état de zoom
console.log("isZoomed? ", isZoomed);

const initialCameraPosition = new THREE.Vector3(12, 5, 12); // Position initiale de la caméra
const initialCameraLookAt = new THREE.Vector3(0, 0, 0); // Point vers lequel la caméra regarde initialement


function zoomToCoordinates(clickCoordinates) {
    console.log("ici");
    const duration = 2000;
    if (isZoomed)
    {
        isZooming = true;
        console.log("LA : x:", clickCoordinates.x, "y:", clickCoordinates.y, "z:", clickCoordinates.z)

        new TWEEN.Tween(camera.position)
            .to({ x: initialCameraPosition.x, y: initialCameraPosition.y, z: initialCameraPosition.z }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                camera.lookAt(initialCameraLookAt);
            })
            .onComplete(() => {
                isZoomed = false;
                isZooming = false;
                localStorage.setItem('isZoomed', isZoomed);
                // camera.position = initialCameraPosition;
                // camera.lookAt(initialCameraLookAt);
                controls.target = initialCameraLookAt;
            })
            .start();
    }
    else if (!isZoomed && selecting_clickable == true && isZooming == false)
    {
        isZooming = true;
        isZoomed = true;
        console.log("isZoomed : ", isZoomed);

        // Zoom towards the clicked coordinates
        const zoomDistance = 2; // Zoom distance relative to the object (adjust as needed)

        // Calculate the direction from the camera to the clicked coordinates
        const direction = new THREE.Vector3();
        direction.subVectors(clickCoordinates, camera.position).normalize();

        // Calculate the target position for the zoom
        const targetPosition = new THREE.Vector3(
            clickCoordinates.x - direction.x * zoomDistance,
            clickCoordinates.y - direction.y * zoomDistance,
            clickCoordinates.z - direction.z * zoomDistance);

        new TWEEN.Tween(camera.position)
            .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                camera.lookAt(clickCoordinates); // Update the lookAt during the animation
            })
            .onComplete(() => {
                // camera.lookAt(initialCameraPosition); // Update the lookAt during the animation
                console.log("coord: x", targetPosition.x, "y:", targetPosition.y, "z:", targetPosition.z)
                isZooming = false;
                controls.target = clickCoordinates;
                // this.controls.position = targetPosition;
                // camera.lookAt(targetPosition);
                if (selected_object_name === "Plane009_2")
                {
                    //se mettre en face de l'ecran
                    changeTemplate('account')
                }
                else if (selected_object_name == "Plane003_2")
                    changeTemplate('pong');
            })
            .start();
    }
}

let isZooming = false;
window.addEventListener('click', onClickScene);

function onClickScene(event) {
    console.log("isZooming :", isZooming);
    if (isZooming)
        return;
    // Calculate the click coordinates in 3D space
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    // Use Raycaster to detect intersections with scene objects
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersection = intersects[0];
        const clickCoordinates = intersection.point;
        zoomToCoordinates(clickCoordinates);
    }
}


//=== ZOOM BACK IF GO BACK ===//
function getZoomState() {
    const zoomState = localStorage.getItem('isZoomed');
    return zoomState === 'true';
}

window.addEventListener('beforeunload', function() {
    localStorage.setItem('isReloaded', 'true');
});

window.addEventListener('pageshow', function(event) {
    const isReloaded = localStorage.getItem('isReloaded') === 'true';
    const isZoomed = getZoomState();

    //page was reloaded
    if (isReloaded)
    {
        if (isZoomed)
            return;
        else
            zoomToCoordinates(initialCameraPosition);
        // Clear the reload flag
        localStorage.removeItem('isReloaded');
    }
});

//=== CHANGE PAGE ===//
function changeTemplate(templateName) {
    const currentUrl = window.location.href;
    const newUrl = `${currentUrl}${templateName}/`;
    window.location.href = newUrl; // Redirect to new URL
    console.log("new URL:", newUrl);
}

function zoomToPC(event){
    // const coordinates = ["2.224749245944513", "2.670698308531501", "-2.3195560957531383"];
    if (isZooming) return;

    // Coordonnées fixes de l'objet vers lequel vous voulez zoomer
    const clickCoordinates = new THREE.Vector3(2.224749245944513, 2.670698308531501, -2.3195560957531383); // Remplacez x, y, z par les coordonnées de l'objet

    selecting_clickable = true;
    selected_object_name = "Plane009_2";
    zoomToCoordinates(clickCoordinates);
}

// Issues :
// - weird camera moovement on complete of animation of zoom
// - can click on other clickable object when in animation
//Plane003_2 == aracade
//Plane009 == pc