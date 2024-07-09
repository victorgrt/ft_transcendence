function launchGame()
{
    console.log("PONG SCRIPT LOADED");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // document.getElementById("scene").appendChild(renderer, domElement);


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
        updateScoreText(); // Initialize the score text once the font is loaded
    });

    // Variables to hold the score text meshes
    let textMesh1, textMesh2;

    // Function to update the score text
    function updateScoreText() {
        if (textMesh1) {
            scene.remove(textMesh1);
            textMesh1.geometry.dispose();
            textMesh1.material.dispose();
        }
        if (textMesh2) {
            scene.remove(textMesh2);
            textMesh2.geometry.dispose();
            textMesh2.material.dispose();
        }

        const textGeometry1 = new THREE.TextGeometry(score_player_1.toString(), {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5,
        });

        const textGeometry2 = new THREE.TextGeometry(score_player_2.toString(), {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5,
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        textMesh1 = new THREE.Mesh(textGeometry1, textMaterial);
        textMesh2 = new THREE.Mesh(textGeometry2, textMaterial);

        // textMesh1.rotation.y = 10;
        // textMesh1.rotation.z = 45;
        // textMesh2.rotation.y = 180;

        scene.add(textMesh1);
        scene.add(textMesh2);

        updateScorePositions(); // Position the score texts initially
    }

    // Function to update the positions of the score texts
    function updateScorePositions() {
        if (textMesh1 && textMesh2) {
            textMesh1.position.set(paddle2.position.x, paddle2.position.y + 1.5, paddle2.position.z);
            textMesh2.position.set(paddle1.position.x, paddle1.position.y + 1.5, paddle1.position.z);
        }
    }

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

    camera.position.set(0, 3, -7); // Position behind the red paddle
    camera.lookAt(0, 0, 0); // The camera looks at the center of the scene
    controls.update(); // Update controls after setting the camera position

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

    let ballSpeedX = 0.05;
    let ballSpeedZ = 0.05;

    const paddleSpeed = 0.075; // Adjusted speed for smoother movements
    const paddleLimitX = 2.3; // Horizontal limit for paddles

    updateScore();

    function updateScore() {
        console.log("score:", score_player_1, " - ", score_player_2);
        if (font) {
            updateScoreText();
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        ball.position.x += ballSpeedX;
        ball.position.z += ballSpeedZ;

        if (ball.position.x >= 2.4 || ball.position.x <= -2.4) {
            ballSpeedX = -ballSpeedX;
        }

        if (ball.position.z <= -4 || ball.position.z >= 4) {
            if (ball.position.z <= -4) {
                score_player_2++;
                updateScore();
                resetBall();
            } else if (ball.position.z >= 4) {
                score_player_1++;
                updateScore();
                resetBall();
            }
        }

        if (ball.position.z >= paddle1.position.z - 0.1 && ball.position.z <= paddle1.position.z + 0.1 && ball.position.x >= paddle1.position.x - 0.4 && ball.position.x <= paddle1.position.x + 0.4) {
            ballSpeedZ = -ballSpeedZ;
            ball.position.z = paddle1.position.z - 0.1;
            ballSpeedX *= 1.1;
            ballSpeedZ *= 1.1;
        }

        if (ball.position.z >= paddle2.position.z - 0.1 && ball.position.z <= paddle2.position.z + 0.1 && ball.position.x >= paddle2.position.x - 0.4 && ball.position.x <= paddle2.position.x + 0.4) {
            ballSpeedZ = -ballSpeedZ;
            ball.position.z = paddle2.position.z + 0.1;
        }

        if (score_player_1 === 10 || score_player_2 === 10) {
            score_player_1 = 0;
            score_player_2 = 0;
            updateScore();
        }

        updateScorePositions(); // Update score positions based on paddle positions
        controls.update();
        renderer.render(scene, camera);
    }

    function resetBall() {
        ball.position.x = 0;
        ball.position.z = 0;
        ballSpeedX = 0.05;
        ballSpeedZ = 0.05;
    }

    let keys = {};
    document.addEventListener('keydown', function(e) {
        keys[e.key] = true;
    });

    document.addEventListener('keyup', function(e) {
        delete keys[e.key];
    });

    function updatePaddles() {
        if ('ArrowRight' in keys && paddle1.position.x > -paddleLimitX) {
            paddle1.position.x -= paddleSpeed;
        }
        if ('ArrowLeft' in keys && paddle1.position.x < paddleLimitX) {
            paddle1.position.x += paddleSpeed;
        }
        if ('d' in keys && paddle2.position.x > -paddleLimitX) {
            paddle2.position.x -= paddleSpeed;
        }
        if ('a' in keys && paddle2.position.x < paddleLimitX) {
            paddle2.position.x += paddleSpeed;
        }

        requestAnimationFrame(updatePaddles);
    }

    updatePaddles();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    var score_player_1 = 0;
    var score_player_2 = 0;

    animate();
}
