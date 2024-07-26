var scene, camera, renderer, loader, controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var highlightedObject = null;
var selected_object_name;
var selecting_clickable;

var initialControlPosition;
var clickCoordinates = null;
function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.outpuEncoding = THREE.RGBEEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(12, 5, 12);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
    document.getElementById('scene').appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);
    var light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);

    loader = new THREE.GLTFLoader();
    const sceneurl = "/staticfiles/pages/images/please.gltf";

    loader.load(
        sceneurl,
        function (gltf) {
            gltf.scene.traverse(function (child) {
                // if (child.isMesh && child.name === 'Plane003_3') {
                //     // Réinitialiser les propriétés d'émission du matériau spécifique
                //     // child.material.emissive = new THREE.Color(0xED7F10); // Noir pour désactiver l'émission
                //     child.material.emissiveIntensity = 1; // Aucune intensité d'émission
                //     // child.material.toneMapped = false; // Aucune intensité d'émission
                // }
                gltf.scene.traverse(function (child) {
                    if (child.isLight) {
                        // Si l'objet est une lumière, ajustez ses propriétés
                        // if (child instanceof THREE.DirectionalLight) {
                            // child.intensity = 100; // Exemple: Réduire l'intensité d'une lumière directionnelle
                        if (child instanceof THREE.PointLight) {
                            child.intensity = 0.5; // Exemple: Réduire l'intensité d'une lumière ponctuelle
                        }
                        if (child.name === 'PointLight')
                        {
                            child.intensity = 15;
                            console.log(child.name, " booste a ", child.intensity);
                        }
                        if (child.name === 'Point002' || child.name === 'Point003')
                        {
                            child.intensity = 5;
                            console.log(child.name, " booste a ", child.intensity);
                        }
                        // if (child instanceof THREE.AmbientLight) {
                            // Si l'objet est une lumière ambiante, ajustez ses propriétés
                            // child.intensity = 0; // Exemple: Réduire l'intensité de la lumière ambiante
                        // }
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
    // const loader_image = new THREE.TextureLoader();
    //     loader_image.load('pages/static/images/background-space.jpg', function(texture) {
    //     texture.minFilter = THREE.LinearFilter; // Use linear filter for minification
    //     texture.magFilter = THREE.LinearFilter; // Use linear filter for magnification
    //     texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Use maximum anisotropy

    //     // Option 1: Set as background
    //     scene.background = texture;
    // });
    console.log("charged ouais la zone");
    window.addEventListener('click', onClickScene);
    document.addEventListener('mousemove', onMouseMove, false);
}
init();
animate();

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
        // document.body.style.cursor = 'pointer';
        var selectedObject = intersects.find(function (intersect) {
            // Check si l'utilisteur est sur un objet cliquable
            if ((intersect.object.name === 'GameScreen_Plane' || intersect.object.name === 'computerScreen_2_1' || intersect.object.name === 'mesh_130') && isZooming === false) {
                selected_object_name = intersect.object.name;
                return intersect.object.name;
            }
        });

        if (selectedObject) {
            console.log("got here");
            selecting_clickable = true;
            var objectToHighlight = selectedObject.object;
            //ARCADE MACHINE
            if (selectedObject.object.name === 'GameScreen_Plane')
                objectToHighlight.material.emissiveIntensity = 100; // Exemple: intensité d'émission pour la surbrillance
            //ECRAN ORDINATEUR
            else if (selectedObject.object.name === 'computerScreen_2_1') {
                objectToHighlight.material.emissiveIntensity = 5; // Exemple: intensité d'émission pour la surbrillance
            }
            else if (selectedObject.object.name === 'mesh_130') {
                objectToHighlight.material.emissiveIntensity = 100; // Exemple: intensité d'émission pour la surbrillance
            }
            // Autres ajustements de surbrillance si nécessaire
            highlightedObject = objectToHighlight;
        }
        else if (!selectedObject) {
            selecting_clickable = false;
            // document.body.style.cursor = 'default';
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

//=== LAUNCH SCRIPT ===//
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onload = function () {
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

window.addEventListener('click', onClickScene);

function onClickScene(event) {
    console.log("isZooming :", isZooming);
    if (isZooming === true || isZoomed === true)
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
        clickCoordinates = intersection.point;
        zoomToCoordinates(clickCoordinates);
    }
}
