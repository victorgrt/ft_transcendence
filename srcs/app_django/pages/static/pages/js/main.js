
var scene, camera, renderer, loader, controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var highlightedObject = null;
var selected_object_name;
var selecting_clickable;

var initialControlPosition;
var clickCoordinates = null;
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
        // document.body.style.cursor = 'pointer';
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

const initialCameraPosition = new THREE.Vector3(12, 5, 12); // Position initiale de la caméra
const initialCameraLookAt = new THREE.Vector3(0, 0, 0); // Point vers lequel la caméra regarde initialement

function zoomToCoordinates(clickCoordinates) {
    const duration = 2000;
    var targetPosition;
    if (isZoomed && selecting_clickable === true) {
        if (loginVisible === true || registerVisible === true)
            return ;
        console.log("HERE BABYBOY")
        isZooming = true;
        if (loginVisible === true)
            hideElement(loginForm);
        else if (registerVisible === true)
            hideElement(registerForm);
        hideElement(goBackButton);
        new TWEEN.Tween(camera.position)
            .to({ x: initialCameraPosition.x, y: initialCameraPosition.y, z: initialCameraPosition.z }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                // camera.lookAt(initialCameraLookAt);
                controls.target = clickCoordinates;
                // camera.target.set.y = clickCoordinates.y;
                // camera.target.set.z = clickCoordinates.z;

            })
            .onComplete(() => {
                if (loginVisible || registerVisible)
                {
                    hideElement(loginForm);
                    hideElement(registerForm);
                }
                isZoomed = false;
                isZooming = false;
                localStorage.setItem('isZoomed', isZoomed);
                // camera.position.set = initialCameraPosition;
                // camera.lookAt = initialCameraLookAt;
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

                    controls.target.x = clickCoordinates.x;
                    controls.target.y = clickCoordinates.y;
                    controls.target.z = clickCoordinates.z;

                    // loginVisible.removeProperty('position');
                    loginForm.style.visibility = 'visible';
                    loginForm.style.opacity = '1';
                    loginForm.style.width = '40%';
                    loginForm.style.position = 'relative';
                    loginVisible = true;

                    registerForm.style.visibility = 'visible';
                    registerForm.style.opacity ='1';
                    registerForm.style.width = '40%';
                    registerForm.style.position = 'relative';
                    registerVisible = true
                    showElement(goBackButton);
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

let isZooming = false;
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
    if (isZoomed === false && isZooming === false)
        zoomToPC();
    if (registerVisible === true)
    {   
        registerForm.style.visibility = 'hidden';
        registerForm.style.opacity = '0';
        resetStyleForms();
        registerVisible = false;
    }    
    loginVisible = true;
    centerLoginForm();
    loginForm.style.opacity = '1';
    loginForm.style.visibility = 'visible';
    loginForm.style.z_index = '2';
    // showElement(goBackButton);
}

function goToRegister() {
    if (isZooming) return;
    if (isZoomed === false && isZooming === false)
        zoomToPC();
    if (loginVisible === true)
    {
        loginForm.style.visibility = 'hidden';
        loginForm.style.opacity = '0';
        resetStyleForms();
        loginVisible = false;
    }
    registerVisible = true;
    centerRegisterForm();
    registerForm.style.opacity = '1';
    registerForm.style.visibility = 'visible';
    registerForm.style.z_index = '2';
    // showElement(goBackButton);
}

function zoomToPC() {

    var clickCoordinates = new THREE.Vector3(2.224749245944513, 2.670698308531501, -2.3195560957531383); // Remplacez x, y, z par les coordonnées de l'objet
    isZooming = true;
    isZoomed = true;
    var dur = 2000;
    //position we want to be
    targetPosition = new THREE.Vector3(2, 2.8, 0.02);
    //position we want to look at
    hardClickCoordinates = new THREE.Vector3(1.8, 2.8, -2.3);
    new TWEEN.Tween(camera.position)
        .to({ x: targetPosition.x, y: targetPosition.y, z: -targetPosition.z }, dur)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            controls.target.x = hardClickCoordinates.x;
            controls.target.y = hardClickCoordinates.y;
            controls.target.z = hardClickCoordinates.z;
        })
    .onComplete(() => {
        console.log("coord: x", targetPosition.x, "y:", targetPosition.y, "z:", targetPosition.z)
        isZooming = false;
        controls.target.x = hardClickCoordinates.x;
        controls.target.y = hardClickCoordinates.y;
        controls.target.z = hardClickCoordinates.z;
        showElement(goBackButton);
    })
    .start();
}

function centerRegisterForm()
{

    contentdiv.style.display = 'flex';
    contentdiv.style.justify_content = 'center';
    contentdiv.style.align_items = 'center';

    registerForm.style.width = '80%';
    // registerForm.style.position = 'absolute';

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
function showElement(element)
{
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    element.style.z_index = '2';
    console.log("z_index_value:", element.style.z_index);
}

function hideElement(element) {
    if (element.classList.contains("register_form"))
        registerVisible = true;
    if (element.classList.contains("login_form"))
        loginVisible = true;
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    element.style.z_index = '-2';
}

// SEEMS LIKE NOT NEEDED BUT KEEP IT HERE JUST IN CASE
function resetStyleForms(){
    // RESET register form style
    contentdiv.style.removeProperty('display');
    contentdiv.style.removeProperty('align_items');
    contentdiv.style.removeProperty('justify_content');

    registerForm.style.visibility = '0';
    registerForm.style.opactity = '0';
    registerForm.style.removeProperty('width');

    // RESET login form style
    loginForm.style.removeProperty('width');
    loginForm.style.removeProperty('position');
    loginForm.style.removeProperty('height');
    registerForm.style.removeProperty('position');
}

function zoomBack() {
    if (statsVisible === true)
    {
        statsDiv.style.visibility = '0';
        statsDiv.style.opacity = '0';
        statsDiv.style.z_index = '-2';
        statsVisible = false;
    }
    if (friendsVisible === true)
    {
        friendsDiv.style.visibility = '0';
        friendsDiv.style.opacity = '0';
        friendsDiv.style.z_index = '-2';
        friendsVisible = false;
    }
    if (registerVisible === true)
    {
        registerForm.style.z_index = '-2';
        registerForm.style.visibility = '0';
        registerForm.style.opacity = '0';
        registerVisible = false;
    }
    if (loginVisible === true)
    {
        loginForm.style.z_index = '-2';   
        loginForm.style.visibility = '0';
        loginForm.style.opacity = '0';
        registerVisible = false;
    }
    if (menuPongVisible === true)
    {
        hideElement(menuPongDiv);
        menuPongVisible = false;
    }
    if (paramsVisible === true)
    {
        paramsDiv.style.z_index = '-2';
        paramsDiv.style.visibility = 'hidden';
        paramsDiv.style.opacity = '0';
        paramsVisible = false;

    }
    hideElement(goBackButton);
    if (isZoomed === false)
        return; //returns because no zoom back needed

    let duration = 2000;
    isZooming = true;
    console.log("initial avt zoom:", initialCameraLookAt, initialCameraPosition);
    new TWEEN.Tween(camera.position)
        .to({ x: initialCameraPosition.x, y: initialCameraPosition.y, z: initialCameraPosition.z }, duration)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(() => {
            if (clickCoordinates != null)
            {
                controls.target.x = clickCoordinates.x;
                controls.target.y = clickCoordinates.y;
                controls.target.z = clickCoordinates.z;
            }
            else
            {
                controls.target.x = initialCameraLookAt.x;
                controls.target.y = initialCameraLookAt.y;
                controls.target.z = initialCameraLookAt.z;
            }
        })
        .onComplete(() => {
            isZoomed = false;
            isZooming = false;
            localStorage.setItem('isZoomed', isZoomed);
            controls.position = new THREE.Vector3(12, 5, 12);
            controls.target.x = initialCameraLookAt.x;
            controls.target.y = initialCameraLookAt.y;
            controls.target.z = initialCameraLookAt.z;
            // const endRotation = new THREE.Quaternion( 0, 0, 0 );
            // camera.applyQuaternion(endRotation); // Apply endRotation
            console.log("quaternion applied");
            showElement(header);
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
    statsDiv.style.z_index = '2';
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
    friendsDiv.style.z_index = '2';
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
    paramsDiv.style.z_index = '2';
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
    notifsDiv.style.z_index = '2';
}

// HANDLE NOTIFICATIONS
function acceptNotif(data){

    console.log("Accepting notif:", data);
    if (data.notification_type === 'play')
    {
        console.log("PLAY");
        //logique de rejoindre la game
        
        window.location.href = '/pong/' + data.data.session_id + '/';

        //delete notif
        var id_to_delete = obj.className;
        var element = document.getElementById(id_to_delete);
        element.remove();
        return ;
    }
    else if (value === 'friend')
    {
        console.log("FRIEND");
        //logique de ajouter en amis
        var notificationId = obj.className;  // Adapter selon votre implémentation
        let test = parseInt(notificationId);
        // Envoyer une requête Ajax pour informer le serveur que l'invitation est acceptée
        $.ajax({
            url: '/accept-friend-request/',  // URL de votre vue Django pour accepter une demande d'ami
            type: 'POST',
            data: {
                notification_id: test  // ID de la notification à accepter
            },
            success: function(response) {
                if (response.status === 'success') {
                    // Gérer la réponse si nécessaire
                    console.log('Friend request accepted successfully');
                } else {
                    // Gérer les erreurs ou autres cas
                    console.error('Error accepting friend request:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
        //delete notif
        var id_to_delete = obj.className;
        var element = document.getElementById(id_to_delete);
        element.remove();
        return;
    }
    else
    {
        var id_to_delete = obj.className;
        var element = document.getElementById(id_to_delete);
        element.remove();
        alert("WRONG NOTIF DUDE");
    }
}

function declineNotif(obj){
    console.log(obj);
    var id_to_delete = obj.className;
    var element = document.getElementById(id_to_delete);
    element.remove();
}

function hideNotifs(){
    console.log("closing notifications div")
    notifsDiv.style.visibility = 'hidden';
    notifsDiv.style.opacity = '0';
    showElement(notifbtn);
}


$(document).ready(function() {
    console.log("on passe ici?");
    $('#sendbtn').click(function(e) {
        e.preventDefault();  // Empêche le formulaire de se soumettre normalement
        
        var formData = {
            'pseudo': $('#inputnotif').val(),
            'notification_type': $('#selectnotif').val(),
            'from_user': $('#from_user').text(),
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
        };

        if (formData.notification_type === "" || formData.pseudo === "")
        {
            console.log("EMPTY ????");
            return ;
        }

        // If type is play with, send request to join game
        if (formData.notification_type === "play with")
        {
            console.log("PLAY WITH");
            $.ajax({
                type: 'POST',
                url: '/send_play_request/',  // L'URL doit correspondre à celle définie dans urls.py
                data: {
                    'to_username': formData.pseudo,
                },
                headers: {
                    'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
                }
                ,
                success: function(response) {
                    console.log(response);
                    compteur_notifs++;
                    window.location.href = '/pong/' + response.session_id + '/';
                },
                error: function(response) {
                    alert('Error: ' + response.statusText);
                }
            });
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/send-notification/',  // L'URL doit correspondre à celle définie dans urls.py
            data: formData,
            success: function(response) {
                if (response.status === 'success') {
                    console.log("la mon reuf");
                    compteur_notifs++;
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

function handleNotification(data)
{
    console.log("compteur :", compteur_notifs);
    console.log("data received:", data);
    var type = "default";
    if (data.message === "play with")
        type = "play";
    else if (data.message === "friend request")
        type = "friend";

    // Create table row
    var tr = document.createElement("tr");
    tr.id = compteur_notifs;

    // Create 'from user' data cell
    var tdFromUser = document.createElement("td");
    tdFromUser.id = "notiftd_from_notif";
    tdFromUser.textContent = data.from_user;

    // Create 'type' data cell
    var tdType = document.createElement("td");
    tdType.id = "notiftd_type";
    tdType.textContent = type;

    // Create 'accept' button cell
    var tdAccept = document.createElement("td");
    tdAccept.id = "notiftd_from_notif";
    var acceptButton = document.createElement("button");
    acceptButton.className = compteur_notifs;
    acceptButton.id = "notifaccept";
    acceptButton.value = type;
    acceptButton.textContent = "V";
    acceptButton.onclick = function() { acceptNotif(data); };
    tdAccept.appendChild(acceptButton);

    // Create 'decline' button cell
    var tdDecline = document.createElement("td");
    tdDecline.id = "notiftd_from_notif";
    var declineButton = document.createElement("button");
    declineButton.className = compteur_notifs;
    declineButton.id = "notifdecline";
    declineButton.textContent = "X";
    declineButton.onclick = function() { declineNotif(data); };
    tdDecline.appendChild(declineButton);

    // Append cells to row
    tr.appendChild(tdFromUser);
    tr.appendChild(tdType);
    tr.appendChild(tdAccept);
    tr.appendChild(tdDecline);

    // Append row to table
    document.getElementById("notiftable").appendChild(tr);
}

