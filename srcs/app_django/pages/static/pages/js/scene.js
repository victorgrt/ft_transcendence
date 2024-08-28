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
var interval;
let lampOn = true;
var acceptedModal = false;

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
    const sceneurl = "/staticfiles/pages/images/scene_final2.glb";

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

    //     scene.background = texture;
    // });
    window.addEventListener('click', onClickScene);
    document.addEventListener('mousemove', onMouseMove, false);
}
init();
animate();
const intensityValues = [1.5, 1.45, 1.4, 1.35, 1.3, 1.25, 1.2, 1.15, 1.1, 1.05, 1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05, 0, -0.05, -0.1, -0.15, -0.2, -0.25, -0.3, -0.35, -0.4, -0.45, -0.5, -0.55, -0.6, -0.65, -0.7, -0.75, -0.8, -0.85, -0.9, -0.95, -1, -1.05, -1.1, -1.15, -1.2, -1.25, -1.3, -1.35, -1.4, -1.45, -1.5, -1.55, -1.6, -1.65, -1.7, -1.75, -1.8, -1.85, -1.9, -1.95, -2];
let currentIndex = 0;

// Function to update the intensity
let forward = true; // Direction flag
let updatingIntensity = false;
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

function isMouseOverElement(event, element) {
    if (!element || friendsVisible === false || notifsVisible === false) {
        return false;
    }

    // Get the bounding rectangle of the element
    var rect = element.getBoundingClientRect();
    console.log("should be returning true???");
    return event.clientX >= rect.left && event.clientX <= rect.right &&
           event.clientY >= rect.top && event.clientY <= rect.bottom;
}

function onMouseMove(event) {
    // Mettre à jour la position du pointeur de la souris
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le rayon de projection pour la souris
    raycaster.setFromCamera(mouse, camera);
    const pseudo = document.getElementById("user_stats");
    if (pseudo)
    {
        if (isMouseOverElement(event, friendsDiv))
        {
            document.body.style.cursor = 'default';
            return;
        }
        if (event.target.id === "notifications" || event.target.id === "notiftitle" || event.target.id === "closeNotifs")
        {
            document.body.style.cursor = 'default';
            return;
        }
        if (event.target.id === "change_prof" || event.target.id === "top")
        {
            console.log("HIDDDDDDING");
            document.body.style.cursor = 'default';
            return;
        }
    }
    // Trouver les intersections avec les objets de la scène
    var intersects = raycaster.intersectObjects(scene.children, true);
    // Réinitialiser l'objet surligné précédent
    if (highlightedObject) {
        if (highlightedObject.name === "lampSquareFloor_2") {
            highlightedObject.material.color.setRGB(0.7454042095350284, 0.010960094003125918, 0.01764195448412081);
            highlightedObject = null;
            return;
        }
        highlightedObject.material.emissiveIntensity = 1; // Réinitialiser l'intensité d'émission
        highlightedObject = null;
    }
    // Mettre en surbrillance l'objet spécifique
    if (intersects.length > 0) {
        var selectedObject = intersects.find(function (intersect) {
            // Check si l'utilisteur est sur un objet cliquable
            if ((intersect.object.name === 'GameScreen_Plane' || intersect.object.name === 'computerScreen_2_1' || intersect.object.name === 'lampSquareFloor_2' || intersect.object.name === 'group780585218' || intersect.object.name === 'Plane001_Door_0' || intersect.object.name === "Couch" || intersect.object.name === "Node-Mesh") && isZooming === false) {
                selected_object_name = intersect.object.name;
                return intersect.object.name;
            }
        });

        if (selectedObject && dontClick === false) {
            selecting_clickable = true;
            var objectToHighlight = selectedObject.object;
            if (selectedObject.object.name === 'GameScreen_Plane')
                objectToHighlight.material.emissiveIntensity = 100; // Exemple: intensité d'émission pour la surbrillance
            else if (selectedObject.object.name === 'computerScreen_2_1') {
                objectToHighlight.material.emissiveIntensity = 5; // Exemple: intensité d'émission pour la surbrillance
            }
            else if (selectedObject.object.name === 'lampSquareFloor_2') {
                objectToHighlight.material.color.setHex(0xFFFFFF);
            }
            else if (selectedObject.object.name === 'group780585218') {
                objectToHighlight.material.emissiveIntensity = 1; // Exemple: intensité d'émission pour la surbrillance
                objectToHighlight.material.color.setRGB(0.7454042095350284, 0.010960094003125918, 0.01764195448412081);
            }
            else if (selectedObject.object.name === 'Plane001_Door_0') {
                objectToHighlight.material.emissiveIntensity = 100;
            }
            else if (selectedObject.object.name === "Node-Mesh")
                objectToHighlight.material.emissiveIntensity = 100;
            else if (selectedObject.object.name === "Couch")
                document.body.style.cursor = 'pointer';
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

function toggleInterval() {
    if (updatingIntensity === false)
    {
        interval = setInterval(updateIntensity, 75);
        updatingIntensity = true;
        console.log("Interval started");
    } else
    {
        console.log("Stopping interval");
        clearInterval(interval);
        updatingIntensity = false;
        ambientLight.intensity = 1;
        console.log("Interval stopped");
    }
}

function checkEvent(event) {
    console.log("event:", event);
    // Get references to the main containers
    const friendsContainer = document.getElementById("friends");
    const notificationsContainer = document.getElementById("notifications");
    const settingsContainer = document.getElementById("change_prof");
    const userContainer = document.getElementById("user_stats");
    const tournamentContainer = document.getElementById("tournament-container");

    if (friendsContainer && friendsContainer.contains(event.target)) {
        console.log("Positive boss - clicked inside friends container");
        return true;
    }

    if (notificationsContainer && notificationsContainer.contains(event.target)) {
        console.log("Overlapping with notifications");
        return true;
    }

    if (settingsContainer && settingsContainer.contains(event.target)) {
        console.log("Overlapping with settings");
        return true;
    }

    if (userContainer && userContainer.contains(event.target)) {
        console.log("Positive boss - clicked inside user container");
        return true;
    }

    if (tournamentContainer && tournamentContainer.contains(event.target)) {
        console.log("Positive boss - clicked inside tournament container");
        return true;
    }


    // If none of the above, click is outside the specified areas
    console.log("Negative boss - clicked outside specified containers");
    return false;
}



function onClickScene(event) {
    if (isZooming === true || isZoomed === true)
        return;

    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log("interects:", intersects);

    if (intersects.length > 0) {
        const intersection = intersects[0];
        // console.log("here:", intersection);
        if (intersection.object.name === "Couch") {
            if (isMouseOverElement(event, notifsDiv) || checkEvent(event)) {
                document.body.style.cursor = 'default';
                return;
            }
            if (checkEvent(event))
                return;
            else
            {
                document.body.style.cursor = 'pointer';
                zoomToCouch();
            }
        }
        if (intersection.object.name === "lampSquareFloor_2") {
            console.log("clicked on lamp :", intersection);
            if (checkEvent(event))
                return ;
            let lampLight = scene.getObjectByName("PointLight");
            if (lampOn === true) {
                lampLight.intensity = 0.5;
                lampOn = false;
            }
            else {
                lampLight.intensity = 5;
                lampOn = true;
            }
            return;
        }
        if (intersection.object.name === "Node-Mesh") {
            if (checkEvent(event))
                return ;
            console.log("clicked on switch :");
            if (ambientLight.intensity == 0)
                ambientLight.intensity = 1;
            else
                ambientLight.intensity = 0;
            return;
        }
        if (intersection.object.name === "group780585218") {
            console.log("acceptedModal:", acceptedModal);
            if (acceptedModal === false) {
                console.log("entering");
                showWarningModal();
            }
            else
            {
                if (checkEvent(event))
                return ;

                toggleInterval();
            }
            return;
        }

        if (intersection.object.name === "Plane001_Door_0") {
            const pseudo = document.getElementById("user_stats");
            if (pseudo)
            {
                if (isMouseOverElement(event, friendsDiv) || checkEvent(event)) {
                    document.body.style.cursor = 'default';
                    return;
                }
                else if (checkEvent(event))
                    return;
                showSureLoggout();
            }
            else {
                console.log("should enter here right")
                showLoggoutErrorModal();
                return;
            }
            return;
        }
        if (intersection.object.name === "GameScreen_Plane") {
            console.log("ARCADE CLICKED");
            const pseudo = document.getElementById("user_stats");
            console.log("pseudo:", pseudo)
            if (pseudo) {
                if (checkEvent(event))
                    return ;    
                //ZOOM TO ARCADE + DISPLAY MENU PONG
                zoomToArcade();
                return;
            }
            else {
                console.log("should enter here right")
                showPongErrorModal();
                return;
            }
            return;
        }
        else if (intersection.object.name === "computerScreen_2_1") {
            console.log("SCREEN CLICKED")
            const pseudo = document.getElementById("user_stats");
            console.log("pseudo:", pseudo)
            //CHECK IF NOT LOGGED IN
            if (!pseudo) {
                //ZOOM TO SCREEN
                zoomToPC();
            }
            else {
                if (checkEvent(event))
                    return ;
                zoomToPCWhileLogged();
            }
            return;
        }
    }
}
