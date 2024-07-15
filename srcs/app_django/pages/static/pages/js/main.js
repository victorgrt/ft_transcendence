
var scene, camera, renderer, loader, controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var highlightedObject = null;
var selected_object_name;
var selecting_clickable;

var initialControlPosition;

function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(12, 5, 12);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
    renderer.outpuEncoding = THREE.RGBEEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    document.getElementById('scene').appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);
    var light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);

    loader = new THREE.GLTFLoader();
    const sceneurl = "/staticfiles/pages/images/scene-18.gltf";

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
            if ((intersect.object.name === 'Plane003_2' || intersect.object.name === 'Plane009_2') && isZooming === false) {
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
            else if (selectedObject.object.name === 'Plane009_2') {
                objectToHighlight.material.emissiveIntensity = 5; // Exemple: intensité d'émission pour la surbrillance
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

init();

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

//=== ZOOM INTO OBJECTS ===//
let isZoomed = localStorage.getItem('isZoomed') === 'true'; // Pour suivre l'état de zoom
console.log("isZoomed? ", isZoomed);

const initialCameraPosition = new THREE.Vector3(12, 5, 12); // Position initiale de la caméra
const initialCameraLookAt = new THREE.Vector3(0, 0, 0); // Point vers lequel la caméra regarde initialement

function zoomToCoordinates(clickCoordinates, redirect_flag) {
    const duration = 2000;
    var targetPosition;
    if (isZoomed && selecting_clickable === true && (loginVisible || registerVisible) === false) {
        isZooming = true;
        console.log("LA : x:", clickCoordinates.x, "y:", clickCoordinates.y, "z:", clickCoordinates.z)
        if (loginVisible === true)
            hideElement(loginForm);
        else if (registerVisible === true)
            hideElement(registerForm);
        hideElement(goBackButton);
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
                camera.position.set = initialCameraPosition;
                camera.lookAt = initialCameraLookAt;
            })
            .start();
    }
    else if (!isZoomed && selecting_clickable == true && isZooming == false) {
        isZooming = true;
        isZoomed = true;
        console.log("isZoomed : ", isZoomed);
        const zoomDistance = 2; // Zoom distance relative to the object (adjust as needed)
        const direction = new THREE.Vector3();
        direction.subVectors(clickCoordinates, camera.position).normalize();
        if (selected_object_name == "Plane009_2") {
            console.log("click :", clickCoordinates);
            targetPosition = new THREE.Vector3(2, 2.8, 0.02);
            new TWEEN.Tween(camera.position)
                .to({ x: targetPosition.x, y: targetPosition.y, z: -targetPosition.z }, duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    controls.target.x = clickCoordinates.x;
                    controls.target.y = clickCoordinates.y;
                    controls.target.z = clickCoordinates.z;
                })
                .onComplete(() => {
                    console.log("coord: x", targetPosition.x, "y:", targetPosition.y, "z:", targetPosition.z)
                    isZooming = false;

                    controls.target.x = targetPosition.x;
                    controls.target.y = targetPosition.y;
                    controls.target.z = -targetPosition.z;
                    console.log("HERE");
                    if (redirect_flag === 0) {
                        ;
                        // showElement(loginForm);
                        // hideElement(header);
                        // goBackButton.style.visibility = 'visible';
                    }
                    else if (redirect_flag === 1) {
                        ;
                        // showElement(registerForm);
                        // hideElement(header);
                        // goBackButton.style.visibility = 'visible';
                    }
                })
                .start();
        }
        else if (selected_object_name == "Plane003_2") {
            targetPosition = new THREE.Vector3(1.75, 3.7, 2.5);
            new TWEEN.Tween(camera.position)
                .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    camera.lookAt(-targetPosition.x, targetPosition.y, targetPosition.z);
                })
                .onComplete(() => {
                    console.log("coord: x", targetPosition.x, "y:", targetPosition.y, "z:", targetPosition.z)
                    isZooming = false;
                    controls.target.x = -targetPosition.x;
                    controls.target.y = targetPosition.y;
                    controls.target.z = targetPosition.z;
                    menuPongVisible = true;
                    showElement(menuPongDiv);
                    loadMenuPong();
                    hideElement(header);
                    showElement(goBackButton);
                })
                .start();
        }
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.getElementById(selector)) {
            return resolve(document.getElementById(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.getElementById(selector)) {
                observer.disconnect();
                resolve(document.getElementById(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
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

window.addEventListener('beforeunload', function () {
    localStorage.setItem('isReloaded', 'true');
});

window.addEventListener('pageshow', function (event) {
    const isReloaded = localStorage.getItem('isReloaded') === 'true';
    const isZoomed = getZoomState();

    //page was reloaded
    if (isReloaded) {
        if (isZoomed)
            return;
        else
            zoomToCoordinates(initialCameraPosition);
        // Clear the reload flag
        localStorage.removeItem('isReloaded');
    }
});

function goToLogin() {
    if (isZooming) return;

    const clickCoordinates = new THREE.Vector3(2.224749245944513, 2.670698308531501, -2.3195560957531383); // Remplacez x, y, z par les coordonnées de l'objet

    selecting_clickable = true;
    selected_object_name = "Plane009_2";
    zoomToCoordinates(clickCoordinates, 0);
    showElement(loginForm);
}

function goToRegister() {
    if (isZooming) return;
    const clickCoordinates = new THREE.Vector3(2.224749245944513, 2.670698308531501, -2.3195560957531383); // Remplacez x, y, z par les coordonnées de l'objet

    selecting_clickable = true;
    selected_object_name = "Plane009_2";
    zoomToCoordinates(clickCoordinates, 1);
    showElement(registerForm);
}

function zoomToPC() {
    if (isZooming) return;

    // Coordonnées fixes de l'objet vers lequel vous voulez zoomer
    const clickCoordinates = new THREE.Vector3(2.224749245944513, 2.670698308531501, -2.3195560957531383); // Remplacez x, y, z par les coordonnées de l'objet

    selecting_clickable = true;
    selected_object_name = "Plane009_2";
    zoomToCoordinates(clickCoordinates);
}

function centerRegisterForm()
{

    contentdiv.style.display = 'flex';
    contentdiv.style.justify_content = 'center';
    contentdiv.style.align_items = 'center';

    registerForm.style.width = '80%';

    loginForm.style.position = 'absolute';
}


function centerLoginForm()
{
    contentdiv.style.display = 'flex';
    contentdiv.style.justify_content = 'center';
    contentdiv.style.align_items = 'center';

    loginForm.style.width = '50%';
    loginForm.style.height = '40%';

    registerForm.style.position = 'absolute';
}

var loginVisible;
var registerVisible;
var menuPongVisible;
function showElement(element) {
    console.log("here:", element.className);
    if (element.className === "register_form")
    {
        registerVisible = true;
        centerRegisterForm();
        showElement(goBackButton);
    }
    if (element.className === "login_form")
    {
        loginVisible = true;
        centerLoginForm();
        showElement(goBackButton);
    }
    element.style.opacity = '1';
    element.style.visibility = 'visible';
}

function hideElement(element) {
    if (element.classList.contains("register_form"))
        registerVisible = true;
    if (element.classList.contains("login_form"))
        loginVisible = true;
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
}

function resetStyleForms(){
    // RESET register form style
    contentdiv.style.removeProperty('display');
    contentdiv.style.removeProperty('align_items');
    contentdiv.style.removeProperty('justify_content');

    registerForm.style.visibility = '0';
    registerForm.style.opactity = '0';
    registerForm.style.removeProperty('width');
    loginForm.style.removeProperty('position');

    // RESET login form style
    loginForm.style.removeProperty('width');
    loginForm.style.removeProperty('height');
    registerForm.style.removeProperty('position');
}

function zoomBack() {
    if (statsVisible === true)
    {
        statsDiv.style.visibility = '0';
        statsDiv.style.opacity = '0';
        statsVisible = false;
    }
    if (friendsVisible === true)
    {
        friendsDiv.style.visibility = '0';
        friendsDiv.style.opacity = '0';
        friendsVisible = false;
    }
    if (registerVisible === true)
    {
        registerForm.style.visibility = '0';
        registerForm.style.opacity = '0';
    }
    if (loginVisible === true)
    {
        loginForm.style.visibility = '0';
        loginForm.style.opacity = '0';
    }
    if (menuPongVisible === true)
    {
        hideElement(menuPongDiv);
        menuPongVisible = false;
    }
    if (paramsVisible === true)
    {
        paramsDiv.style.visibility = 'hidden';
        paramsDiv.style.opacity = '0';
        paramsVisible = false;

    }
    // if (notifsVisible === true)
    // {
    //     notifsDiv.style.visibility = 'hidden';
    //     notifsDiv.style.opacity = '0';
    //     notifsVisible = false;
    //     showElement(notifbtn);
    // }
    hideElement(goBackButton);
    if (isZoomed === false)
        return; //returns because no zoom back needed

    let duration = 2000;
    isZooming = true;
    console.log("initial avt zoom:", initialCameraLookAt, initialCameraPosition);
    new TWEEN.Tween(camera.position)
        .to({ x: initialCameraPosition.x, y: initialCameraPosition.y, z: initialCameraPosition.z }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.lookAt(initialCameraLookAt);
            // controls.target = clickCoordinates;
        })
        .onComplete(() => {
            isZoomed = false;
            isZooming = false;
            localStorage.setItem('isZoomed', isZoomed);
            controls.position = initialCameraPosition;
            controls.position = new THREE.Vector3(12, 5, 12);
            controls.target =  new THREE.Vector3(0, 0, 0);
            showElement(header);
            console.log("apres:", initialCameraLookAt, initialCameraPosition);
        })
        .start();
}

var statsVisible = false;
function showStats(){
    if (statsVisible === true)
    {
        zoomBack();
        return;
    }
    statsDiv.style.visibility = 'visible';
    statsDiv.style.opacity = '1';
    statsVisible = true;
    showElement(goBackButton);
    statsVisible = true;
}

var friendsVisible = false;
function showFriends(){
    if (friendsVisible === true)
    {
        hideElement(goBackButton);
        friendsDiv.style.visibility = '0';
        friendsDiv.style.opacity = '0';
        friendsVisible = false;
        return;
    }
    friendsDiv.style.visibility = 'visible';
    friendsDiv.style.opacity = '1';
    showElement(goBackButton);
    friendsVisible = true;
}

var paramsVisible = false;
function showParams()
{
    console.log("coucou");
    if (paramsVisible === true)
    {
        hideElement(goBackButton)
        paramsDiv.style.visibility = '0';
        paramsDiv.style.opacity = '0';
        paramsVisible = false;
        return;
    }
    paramsDiv.style.visibility = 'visible';
    paramsDiv.style.opacity = '1';
    paramsVisible = true;
    showElement(goBackButton);
    console.log("tg");
}

var notifsVisible = false;
function showNotifs(){
    const notifbtn = document.getElementById("notifbtn");
    hideElement(notifbtn);
    notifsDiv.style.visibility = 'visible';
    notifsDiv.style.opacity = '1';
    notifsVisible = true;
}

// HANDLE NOTIFICATIONS
function acceptNotif(){
    console.log("accept notification here!");
}

function declineNotif(){
    console.log("decline notif here!");
}

function hideNotifs(){
    console.log("closing notifications div")
    notifsDiv.style.visibility = '0';
    notifsDiv.style.opacity = '0';
    showElement(notifbtn);
}

// function handleSendNotif(){
//         // Récupérer la valeur de l'input
//         var inputVal = document.getElementById("inputnotif").value;
//         // Récupérer la valeur du select
//         var selectVal = document.getElementById("selectnotif").value;
//         alert("Notification sent to " + inputVal + ": " + selectVal);
//         // Afficher les valeurs dans la console
//         console.log("PSEUDO:", inputVal);
//         console.log("Notification Type:", selectVal);
// }


$(document).ready(function() {
    $('#sendbtn').click(function(e) {
        e.preventDefault();  // Empêche le formulaire de se soumettre normalement
        
        var formData = {
            'pseudo': $('#inputnotif').val(),
            'notification_type': $('#selectnotif').val(),
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        };
        
        $.ajax({
            type: 'POST',
            url: '/send-notification/',  // L'URL doit correspondre à celle définie dans urls.py
            data: formData,
            success: function(response) {
                if (response.status === 'success') {
                    alert(response.message);
                } else {
                    alert(response.message);
                }
            },
            error: function(response) {
                alert('Error: ' + response.statusText);
            }
        });
    });
});

// function sendNotification() {
//     var formData = {
//         'pseudo': document.getElementById("inputnotif").value,
//         'notification_type': document.getElementById("selectnotif").value,
//         'csrfmiddlewaretoken': document.querySelector('[name=csrfmiddlewaretoken]').value
//     };

//     var test = '{% url "send_notifications" %}' ;
//     console.log(test);
//     console.log('{% url "send_notifications" %}')

//     $.ajax({
//         type: 'POST',
//         url: 'send-notification/',
//         data: formData,
//         success: function(response) {
//             if (response.status === 'success') {
//                 alert(response.message);
//             } else {
//                 alert(response.message);
//             }
//         },
//         error: function(response) {
//             alert('An error occurred.');
//         }
//     });
// }