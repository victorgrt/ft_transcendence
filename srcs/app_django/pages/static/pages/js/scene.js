console.log("SCENE LOADED")
var scene, camera, renderer, loader, controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var highlightedObject = null;
var selected_object_name;
var selecting_clickable;
var ambientLight;
var initialControlPosition;
var clickCoordinates = null;
let lampOn = true;
function init() {
    console.warn("inside init");
    console.warn("inside init");
    console.warn("inside init");

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.outpuEncoding = THREE.RGBEEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(13, 5, 13);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
    document.getElementById('scene').appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);
    var light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0xffffff, 1); // Initial intensity of 1
    scene.add(ambientLight);

    loader = new THREE.GLTFLoader();
    const sceneurl = "/staticfiles/pages/images/scene_final.glb";

    loader.load(
        sceneurl,
        function (gltf) {
            gltf.scene.traverse(function (child) {
                ambientLight.intensity = 1;
                // if (child.isMesh && child.name === 'Plane003_3') {
                //     // Réinitialiser les propriétés d'émission du matériau spécifique
                //     // child.material.emissive = new THREE.Color(0xED7F10); // Noir pour désactiver l'émission
                //     child.material.emissiveIntensity = 1; // Aucune intensité d'émission
                //     // child.material.toneMapped = false; // Aucune intensité d'émission
                // }
                gltf.scene.traverse(function (child) {
                    // if (child.isAmbientLight) {
                        // console.log("boosted the ambiant");
                        // child.intensity = 100; // Change this value to your desired intensity
                    // }
                    if (child.isLight) {
                        // Si l'objet est une lumière, ajustez ses propriétés
                        // if (child instanceof THREE.DirectionalLight) {
                            // child.intensity = 100; // Exemple: Réduire l'intensité d'une lumière directionnelle
                        if (child instanceof THREE.PointLight) {
                            child.intensity = 0.5; // Exemple: Réduire l'intensité d'une lumière ponctuelle
                        }
                        if (child.name === 'PointLight')
                            child.intensity = 5;
                        if (child.name === 'Point001' || child.name === 'Point')
                            child.intensity = 3;
                        // if (child.name === 'AmbientLight') {
                         // }
                    }
                });
            });
            scene.add(gltf.scene);

        },
        function (xhr) {
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
    window.addEventListener('click', onClickScene);
    document.addEventListener('mousemove', onMouseMove, false);
}
init();
animate();
const intensityValues = [1.5, 1.4 , 1.3, 1.2, 1.1, 1,0.9, 0.8, 0.7,0.6, 0.5,0.4, 0.3,0.2, 0.1, 0, -0.1,-0.2, -0.3,-0.4, -0.5,-0.6, -0.7, -0.8,-0.9, -1, -1.1 ,-1.2, -1.3, -1.4, -1.5, -1.6, -1.7, -1.8, -1.9, -2];
let currentIndex = 0;

// Function to update the intensity
let forward = true; // Direction flag

// Function to update the intensity
function updateIntensity() {
    ambientLight.intensity = intensityValues[currentIndex];
    
    if (forward) {
        currentIndex++;
        if (currentIndex >= intensityValues.length) {
            currentIndex = intensityValues.length - 1;
            forward = false; // Change direction
        }
    } else {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = 0;
            forward = true; // Change direction
        }
    }
}
// Set an interval to update the intensity every second
setInterval(updateIntensity, 100); // 1000 milliseconds = 1 second

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
        if (highlightedObject.name === "lampSquareFloor_2")
        {
            // 0.7454042095350284, g: 0.010960094003125918, b: 0.01764195448412081 }
            highlightedObject.material.color.setRGB(0.7454042095350284, 0.010960094003125918, 0.01764195448412081);
            highlightedObject = null;
            return;
        }
        highlightedObject.material.emissiveIntensity = 1; // Réinitialiser l'intensité d'émission
        highlightedObject = null;
    }
    // Mettre en surbrillance l'objet spécifique
    if (intersects.length > 0) {
        // document.body.style.cursor = 'pointer';
        var selectedObject = intersects.find(function (intersect) {
            // Check si l'utilisteur est sur un objet cliquable
            // console.log("name:", intersect.object.name);
            if ((intersect.object.name === 'GameScreen_Plane' || intersect.object.name === 'computerScreen_2_1' || intersect.object.name === 'lampSquareFloor_2' || intersect.object.name === 'defaultMaterial' || intersect.object.name === 'Plane001_Door_0') && isZooming === false) {
                console.log("HERE:", intersect.object);
                selected_object_name = intersect.object.name;
                return intersect.object.name;
            }
        });

        if (selectedObject && dontClick === false) {
            document.body.style.cursor = 'pointer';
            selecting_clickable = true;
            var objectToHighlight = selectedObject.object;
            //ARCADE MACHINE
            if (selectedObject.object.name === 'GameScreen_Plane')
                objectToHighlight.material.emissiveIntensity = 100; // Exemple: intensité d'émission pour la surbrillance
            //ECRAN ORDINATEUR
            else if (selectedObject.object.name === 'computerScreen_2_1') {
                objectToHighlight.material.emissiveIntensity = 5; // Exemple: intensité d'émission pour la surbrillance
            }
            else if (selectedObject.object.name === 'lampSquareFloor_2') {
                // objectToHighlight.material.emissiveIntensity = 100; // Exemple: intensité d'émission pour la surbrillance
                objectToHighlight.material.color.setHex(0xFFFFFF);
            }
            else if (selectedObject.object.name === 'defaultMaterial') {
                // objectToHighlight.material.emissiveIntensity = 100; // Exemple: intensité d'émission pour la surbrillance
                objectToHighlight.material.color.setHex(0xFFFFFF);
            }
            else if (selectedObject.object.name === 'Plane001_Door_0') {
                // objectToHighlight.material.emissiveIntensity = 100; // Exemple: intensité d'émission pour la surbrillance
                objectToHighlight.material.color.setHex(0xFFFFFF);
                // objectToHighlight.material.emissive = -5;
                // objectToHighlight.material.emissiveIntensity = 100;
            }

            // Autres ajustements de surbrillance si nécessaire
            highlightedObject = objectToHighlight;
        }
        else if (!selectedObject) {
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
        // console.log("here:", intersection);
        if (intersection.object.name === "lampSquareFloor_2")
        {
            console.log("clicked on lamp :", intersection);
            let lampLight = scene.getObjectByName("PointLight");
            if (lampOn === true)
            {
                lampLight.intensity = 0.5;
                lampOn = false;
            }
            else
            {
                lampLight.intensity = 5;
                lampOn = true;
            }
            return ;
        }
        clickCoordinates = intersection.point;
        zoomToCoordinates(clickCoordinates);
    }
}