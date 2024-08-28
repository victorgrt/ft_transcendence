
function launchGame()
{
    isAnimating = true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("pongScene").appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const bg_image = '/staticfiles/pages/images/arcade.jpg';
    loader.load(bg_image, function(texture) {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        scene.background = texture;
    });

    // Load the font once
    let font;
    const loader_text = new THREE.FontLoader();
    loader_text.load('/staticfiles/pages/fonts/arcades/threejs_font.typeface.json', function(loadedFont) {
        font = loadedFont;
    });

    let pointLight1 = new THREE.PointLight(0xffffff, 0.5); // Soft light
    pointLight1.position.set(7, 2, 1);
    scene.add(pointLight1);

    let pointLight2 = new THREE.PointLight(0xffffff, 1); // Soft light
    pointLight2.position.set(0, 7, -2);
    scene.add(pointLight2);

    let pointLight = new THREE.PointLight(0xffffff, 0.5); // Soft light
    pointLight.position.set(-7, 2, 1);
    scene.add(pointLight);

    let pointLight3 = new THREE.PointLight(0xffffff, 0.5); // Soft light
    pointLight3.position.set(0, 1, 7);
    scene.add(pointLight3);

    let pointLight4 = new THREE.PointLight(0xffffff, 0.5); // Soft light
    pointLight4.position.set(0, 1, -7);
    scene.add(pointLight4);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Add damping (inertia)
    controls.dampingFactor = 0.25; // Damping factor
    controls.screenSpacePanning = true; // Only move the camera around the orbit
    controls.minDistance = 5; // Minimum zoom distance
    controls.maxDistance = 100; // Maximum zoom distance

    const paddleGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.2); // Adjust paddle geometry to make them horizontal
    const paddleMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ffff });
    const paddleMaterial2 = new THREE.MeshPhysicalMaterial({ color: 0xff0000 });
    const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
    const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial2);
    paddle1.position.set(0, 0, 3.5); // Position paddle1 at the top
    paddle2.position.set(0, 0, -3.5); // Position paddle2 at the bottom
    scene.add(paddle1);
    scene.add(paddle2);

    const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const ballMaterial = new THREE.MeshPhysicalMaterial();
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    const wallGeometry = new THREE.BoxGeometry(0.2, 0.2, 7); // Adjust wall geometry to make them vertical
    const wallMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff781f });
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.x = -2.5; // Position the left wall closer to the center
    rightWall.position.x = 2.5; // Position the right wall closer to the center
    scene.add(leftWall);
    scene.add(rightWall);

    // var socket = new WebSocket("socket://localhost:8000/socket/pong/your_game_id/");
    //initializeWebSocket(self.gameId);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    function updateState()
    {
        ball.position.x = gamedata.game_state.ball_position[0];
        ball.position.z = gamedata.game_state.ball_position[1];

        paddle1.position.x = gamedata.game_state.player_1_position;
        paddle2.position.x = gamedata.game_state.player_2_position;

        score_player_1 = gamedata.game_state.player_1_score;
        score_player_2 = gamedata.game_state.player_2_score;
        let displayText = gamedata.game_state.player_1_login.toString() + " : " + score_player_1.toString() + " | " + gamedata.game_state.player_2_login.toString() + " : " + score_player_2.toString();
        document.getElementById('score').innerText = displayText;
    };


    function updateCountdownHTML(countdown)
    {
        let displayText;
        if (countdown > 0)
            displayText = `${countdown}`;
        else if (countdown === 0)
            displayText = "START";
        else if (countdown == -1)
            displayText = "";
        document.getElementById('countdownDisplay').innerText = displayText;
    }

    function showElement(element)
    {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.z_index = '2';
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

    function animate()
    {
        if (!isAnimating) 
        {
            console.log("ANIMATION STOPPED");
            return;
        }
        if (gamedata)
        {
            if (set_camera == 0)
            {
                // leaveGameButton.style.z_index = '2';
                id = gamedata.game_state.player_id
                if (id == 2)
                    pov_camera = -7
                else if (id == 1)
                    pov_camera = 7
                camera.position.set(0, 3, pov_camera); // Position behind the red paddle
                camera.lookAt(0, 0, 0); // The camera looks at the center of the scene
                controls.update(); // Update controls after setting the camera position
                set_camera = 1
            }
            updateState();
            renderer.render(scene, camera);
            if (gamedata.game_state.state == "countdown")
                updateCountdownHTML(gamedata.game_state.countdown);  // Mettre à jour le compte à rebours en fonction de la valeur reçue
            else if (gamedata.game_state.state == "playing" && document.getElementById('countdownDisplay').innerText != "")
                updateCountdownHTML(-1);
        }
        requestAnimationFrame(animate);
    }
    animate();
}

