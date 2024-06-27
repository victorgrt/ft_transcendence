var scene, camera, renderer, loader, controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function init() {
    scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(12,5,12);
    // Ajouter OrbitControls après chargement du modèle
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update(); // Mettre à jour les contrôles une première fois
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
	document.addEventListener('mousemove', onMouseMove, false);
    animate();
}

var highlightedObject = null;

var selecting_clickable;
var full_computer;

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
        // highlightedObject.material.emissive = new THREE.Color(255, 255, 255);
        highlightedObject = null;
        console.log("ON EST PASSE LA G")
    }

    // Mettre en surbrillance l'objet spécifique
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        var selectedObject = intersects.find(function (intersect) {
            // console.log("here : ", intersect.object.name);
            // Check si l'utilisteur est sur un objet cliquable
            if (intersect.object.name === 'Plane003_2' || intersect.object.name === 'Plane009_2')
            {
                console.log("object name : ", intersect.object.name);
                // full_computer = Plane009_1.object;
                // console.log(full_computer.Color);
                return intersect.object.name;
            }
        });
        
        if (selectedObject) {
            console.log("NEED HIGHLIGTHING to :", selectedObject);
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
    // renderer.render(scene, camera);
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
let isZoomed = false; // Pour suivre l'état de zoom

const initialCameraPosition = new THREE.Vector3(12, 5, 12); // Position initiale de la caméra
const initialCameraLookAt = new THREE.Vector3(0, 0, 0); // Point vers lequel la caméra regarde initialement

function zoomToCoordinates(clickCoordinates) {
    console.log("zooming");

    // Durée de l'animation
    const duration = 2000; // Durée de l'animation en millisecondes (ici 2 secondes)

    if (isZoomed) {
        // Dézoomer vers la position initiale de la caméra
        new TWEEN.Tween(camera.position)
            .to({ x: initialCameraPosition.x, y: initialCameraPosition.y, z: initialCameraPosition.z }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                isZoomed = false; // Mettre à jour l'état de zoom
            })
            .start();
    } else if (!isZoomed && selecting_clickable == true) {
        console.log("ici")
        // Zoomer vers les coordonnées cliquées
        const zoomDistance = 0.5; // Distance de zoom par rapport à l'objet (à ajuster selon vos besoins)

        // Calculer la direction de la caméra vers les coordonnées cliquées
        const direction = new THREE.Vector3();
        direction.subVectors(clickCoordinates, camera.position).normalize();

        // Calculer la position cible pour le zoom
        const targetPosition = new THREE.Vector3(
            clickCoordinates.x - direction.x * zoomDistance,
            clickCoordinates.y - direction.y * zoomDistance,
            clickCoordinates.z - direction.z * zoomDistance
        );
        camera.lookAt(initialCameraPosition);

        // Animer la position de la caméra vers les coordonnées cliquées
        new TWEEN.Tween(camera.position)
            .to({ x: targetPosition.x - 2, y: targetPosition.y, z: targetPosition.z }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                console.log("launch script")
                camera.lookAt(initialCameraPosition);
                function changeTemplate(templateName) {
                    const currentUrl = window.location.href;
                    const baseUrl = currentUrl.split('/scene/')[0]; // Extract base URL
                    const newUrl = `${baseUrl}/${templateName}/`;
                    window.location.href = newUrl; // Redirect to new URL
                    console.log("new :", newUrl);
                }
                changeTemplate('pong');
            })
            .start();
    }
}


window.removeEventListener('click', onClickScene, false); // Assure que l'écouteur est retiré d'abord
window.addEventListener('click', onClickScene, false);

animate();

function onClickScene(event) {
        // Calculer les coordonnées du clic dans l'espace 3D
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
    
        // Utiliser Raycaster pour détecter les intersections avec les objets de la scène
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
    
        if (intersects.length > 0) {
            const intersection = intersects[0];
            const clickCoordinates = intersection.point;
    
            // Appeler zoomToCoordinates avec les coordonnées cliquées
            zoomToCoordinates(clickCoordinates);
        }
    }