
function launchGameIA()
{
    isAnimating = true; // Flag to control the animation loop
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    id = 1;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("pongScene").appendChild(renderer.domElement);

const paddleWidth = 20;
const paddleHeight = 200;
const ballRadius = 10;

let wPressed = false;
let sPressed = false;

let hue = 0;

let gameMode = -1;
let pause = 0;
let winner = 0;

const paddleSpeed = 8;
let player1Paddle = {
  score_P1: 0,
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
  phi: 0.6,
  // d : Math.sqrt(Math.pow(((coord.xB - coord.xA) / 2),2) + Math.pow(((coord.yB - coord.yA) / 2),2)),
  // tanganteVector :
  // {
  //   xT : 1 / d * (coord.xB - coord.xA),
  //   yT : 1 / d * (coord.yB - coord.yA),
  // },
  // normalVector :
  // {
  //   xN : 1 / d * (coord.yB - coord.yA),
  //   yN : 1 / d * (coord.xA - coord.xB),
  // }
};

let player2Paddle = {
  score_P2: 0,
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 4,
  phi: 0.6,
};

let ball =
{
  lastPoints : [],
  speedVector:
  {//Math. random() * (max - min) + min
    dx: 5 + (Math.random() * (2 + 2) - 2),
    dy: 5 + (Math.random() * (2 + 2) - 2),
  },
  positionVector:
  {
    x: canvas.width / 2,
    y: canvas.height / 2,
  },
  nextBounce:
  {
    x: 0,
    y: 0,
  },
  trajectory:
  {//equation d'une droite = ax + by + c // ici on ajoutera un gap g
    a : 0,
    b : 0,
    c : 0,
    g : 0.1,
  },
  phi: 0.4,
  radius: ballRadius,
};

function drawPaddle(x, y, width, height)
{
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, width, height);
}

function getNextColor(hue)
{
  hue = (hue + 1) % 360;
  return hue;
}

function rgbToCss(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function drawBallTraj(x, y) // for debugg or item
{
  x2 = x;
  y2 = y;
  if (ball.speedVector.dx > 0)
  {
    while (x2 < 1180 && (y2 > 0 && y2 < 600))
    {
      x2 += ball.speedVector.dx / 20;
      y2 += ball.speedVector.dy / 20;
    }
  }
  else
  {
    while (x2 > 20 && (y2 > 0 && y2 < 600))
    {
      x2 += ball.speedVector.dx / 200;
      y2 += ball.speedVector.dy / 200;
    }
  }
  ball.nextBounce.x = x2;
  ball.nextBounce.y = y2;
  ctx.beginPath()
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 3;
  ctx.stroke();
}

function handleComputerMove()
{
  if (ball.nextBounce.x >= 1180)
  {
    if (player2Paddle.y <= ball.nextBounce.y)
      player2Paddle.y += player2Paddle.dy;
    else if (player2Paddle.y > ball.nextBounce.y)
      player2Paddle.y -= player2Paddle.dy;
  }
  else
    if (player2Paddle.y != canvas.width / 2)
}

function drawBall(x, y, radius)
{
  hue = getNextColor(hue);
  ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawBallTray(x, y)
{
  ctx.save(); // Save current state
  ctx.moveTo(ball.lastPoints[0].x, ball.lastPoints[0].y); // Move to the first point

  for (let i = 1; i < ball.lastPoints.length; i++)
  {
    ctx.beginPath(); // Start a new path for each segment
    ctx.moveTo(ball.lastPoints[i-1].x, ball.lastPoints[i-1].y); // Move to the start of the segment
    ctx.lineTo(ball.lastPoints[i].x, ball.lastPoints[i].y); // Draw the segment

    // Set the stroke style and line width for the segment
    ctx.strokeStyle = "rgba(255, 255, 255, " + (1 - i / ball.lastPoints.length) + ")";
    ctx.lineWidth = 20 * (1 - i / ball.lastPoints.length);

    ctx.stroke(); // Stroke the segment
    ctx.restore(); // Restore to the state when save() was last called
  }
}
function drawField() {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  // Dessiner la ligne centrale
  ctx.beginPath();
  ctx.setLineDash([10, 10]); // Ligne en pointillés
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.setLineDash([]); // Réinitialiser les pointillés

  // Dessiner le cercle central
  ctx.beginPath();
  ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI); // Rayon du cercle de 50
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

function update()
{
  // Handle player 1 move
  if (wPressed && player1Paddle.y > 0)
    player1Paddle.y -= paddleSpeed;
  else if (sPressed && (player1Paddle.y < canvas.height - paddleHeight))
    player1Paddle.y += paddleSpeed;


  //Handle Computer paddle move
  if (gameMode == 0)
  {
    handleComputerMove();
    // player2Paddle.y += player2Paddle.dy;
    // if (player2Paddle.y <= 0 || player2Paddle.y + paddleHeight >= canvas.height)
      // player2Paddle.dy *= -1;
  }

  // Move the ball
  ball.positionVector.x += ball.speedVector.dx;
  ball.positionVector.y += ball.speedVector.dy;

  // record last points
  ball.lastPoints.unshift({x: ball.positionVector.x, y: ball.positionVector.y});
  if (ball.lastPoints.length > 20)
    ball.lastPoints.pop();

  // Handle collision with walls
  if (ball.positionVector.y + ball.radius >= canvas.height || ball.positionVector.y - ball.radius <= 0)
    ball.speedVector.dy *= -1;

  // Handle collision with paddle
  if (ball.positionVector.x - ball.radius <= player1Paddle.x + paddleWidth && ball.positionVector.y >= player1Paddle.y && ball.positionVector.y <= player1Paddle.y + paddleHeight)
  {
    ball.speedVector.dx *= -1;
    ball.speedVector.dx += 0.6;
    ball.positionVector.x += ballRadius;
  }
  else if (ball.positionVector.x + ball.radius >= player2Paddle.x && ball.positionVector.y >= player2Paddle.y && ball.positionVector.y <= player2Paddle.y + paddleHeight)
  {
    ball.speedVector.dx *= -1;
    ball.speedVector.dx -= 0.6;
    ball.positionVector.x -= ballRadius;
  }

  ballSpeed.textContent = Math.abs((Math.round(ball.speedVector.dx * 100) / 100));

  // Detect goal
  if (ball.positionVector.x <= 0)
  {
    //if (ball.positionVector.x - player1Paddle.width < 0)
    if ((ball.nextBounce.x <= 20) && (ball.nextBounce.y <= player1Paddle.y && ball.nextBounce.y >= player1Paddle.y + paddleHeight))
    {//save goal part
      ball.positionVector.x = 100;
      ball.speedVector.dx += 0.6;
      if (ball.speedVector.dx < 0)
        ball.speedVector.dx *= -1;
    }
    else
    {
      player2Paddle.score_P2 += 1;
      score_P2.textContent = player2Paddle.score_P2;
      resetBall(1);
    }
  }
  else if (ball.positionVector.x >= canvas.width)
    {
      if ((ball.nextBounce.x >= 1180) && (ball.nextBounce.y >= player2Paddle.y && ball.nextBounce.y <= player2Paddle.y + player1Paddle.height))
      {//save goal part
        ball.positionVector.x = 1100;
        ball.speedVector.dx -= 0.6;
        if (ball.speedVector.dx > 0)
          ball.speedVector.dx *= -1;
      }
      else
      {
        player1Paddle.score_P1 += 1;
        score_P1.textContent = player1Paddle.score_P1;
        resetBall(2);
      }
    }
}

function resetBall(x)
{
  ball.positionVector.x = canvas.width / 2;
  ball.positionVector.y = canvas.height / 2;
  ball.speedVector.dx = 5 + (Math.random() * (2 + 2) - 2);
  ball.speedVector.dy = 5 + (Math.random() * (2 + 2) - 2);
  ball.lastPoints = [{x: ball.positionVector.x, y: ball.positionVector.y}];
  if (x == 2)
    ball.speedVector.dx *= -1;
}

function draw()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawField();
  drawPaddle(player1Paddle.x, player1Paddle.y, player1Paddle.width, player1Paddle.height);
  drawPaddle(player2Paddle.x, player2Paddle.y, player2Paddle.width, player2Paddle.height);
  drawBall(ball.positionVector.x, ball.positionVector.y, ball.radius);
  drawBallTraj(ball.positionVector.x, ball.positionVector.y);
  drawBallTray(ball.positionVector.x, ball.positionVector.y);
}

function gameLoop()
{
  score_P2.textContent = player2Paddle.score_P2;
  score_P1.textContent = player1Paddle.score_P1;
  if (pause == false && (player1Paddle.score_P1 < 3 && player2Paddle.score_P2 < 3))
  {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
  if (player1Paddle.score_P1 == 3)
    winner = 1;
  else if (player2Paddle.score_P2 == 3)
    winner = 2;
  if (winner == 1)
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "48px serif";
    ctx.fillText("Player 1 win", 10, 50);
    return ;
  }
  if (winner == 2)
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "48px serif";
    ctx.fillText("Player 2 win", 10, 50);
    return ;
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key == "w")
    wPressed = true;
  else if (event.key == "s")
    sPressed = true;
});

document.addEventListener("keyup", (event) => {
    downArrowPressed = false;
  if (event.key == "w")
    wPressed = false;
  if (event.key == "s")
    sPressed = false;
});

function drawCountdown(count, callback) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawField();
  drawPaddle(player1Paddle.x, player1Paddle.y, player1Paddle.width, player1Paddle.height);
  drawPaddle(player2Paddle.x, player2Paddle.y, player2Paddle.width, player2Paddle.height);

  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText(count, canvas.width / 2, canvas.height / 2);

  setTimeout(function() {
    callback(); // Appeler la fonction callback après 1 seconde
  }, 1000);
}

function drawStart()
{
  drawCountdown(3, function()
  {
    drawCountdown(2, function()
    {
      drawCountdown(1, function()
      {
        gameMode = 0;
        gameLoop();
      });
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

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    function handleIAMove()
    {
        const currentTime = Date.now();
            if (gamedata.game_state.ballNextBounce[1] <= 0 && gamedata.game_state.ball_velocity[1] < 0)
            {
                    obj = gamedata.game_state.player_2_position - gamedata.game_state.ballNextBounce[0];
                    if (obj >= -0.4 && obj <= 0.4)
                    {
                        socket.send(JSON.stringify({ action: 'move_paddle', player: 2, direction: 'null', coord : 0}));
                    }
                    else if (obj < -0.4)
                    {
                        socket.send(JSON.stringify({ action: 'move_paddle', player: 2, direction: 'right', coord: gamedata.game_state.ballNextBounce[0]}));
                    }
                    else if (obj > 0.4)
                    {
                        socket.send(JSON.stringify({ action: 'move_paddle', player: 2, direction: 'left', coord: gamedata.game_state.ballNextBounce[0]}));
                    }
                    }
            else
            {
                if (gamedata.game_state.player_2_position > -0.4 && gamedata.game_state.player_2_position < 0.4)
                {
                    socket.send(JSON.stringify({action: 'move_paddle', player:2, direction: 'null', coord : 0}));
                }
                else if (gamedata.game_state.player_2_position > 0)
                {
                    socket.send(JSON.stringify({action: 'move_paddle', player:2, direction: 'left', coord : 0}));
                }
                else if (gamedata.game_state.player_2_position < 0)
                {
                    socket.send(JSON.stringify({action: 'move_paddle', player:2, direction: 'right', coord : 0}));
                }
            }
    }

    function updateState()
    {
        ball.position.x = gamedata.game_state.ball_position[0];
        ball.position.z = gamedata.game_state.ball_position[1];

        paddle1.position.x = gamedata.game_state.player_1_position;
        paddle2.position.x = gamedata.game_state.player_2_position;

        score_player_1 = gamedata.game_state.player_1_score;
        score_player_2 = gamedata.game_state.player_2_score;
        handleIAMove();
        let displayText = gamedata.game_state.player_1_login.toString() + " : " + score_player_1.toString() + " | IA : " + score_player_2.toString();
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


    function animate()
    {
  ;
        if (!isAnimating) 
        {
            console.log("ANIMATION STOPPED");
            return;
        }
        if (gamedata)
        {
            if (set_camera == 0)
            {
                socket.send(JSON.stringify({action : 'IA_game'}));
                camera.position.set(0, 3, 7); // Position behind the red paddle
                camera.lookAt(0, 0, 0); // The camera looks at the center of the scene
                controls.update(); // Update controls after setting the camera position
                set_camera = 1
                console.log("SET_CAMERA: " + set_camera);
            }
            updateState();
            renderer.render(scene, camera);
            if (gamedata.game_state.state == "countdown")
                updateCountdownHTML(gamedata.game_state.countdown);  // Mettre à jour le compte à rebours en fonction de la valeur reçue
            else if (gamedata.game_state.state == "playing" && document.getElementById('countdownDisplay').innerText != "")
                updateCountdownHTML(-1);
        }
        if (gamedata)
            handleIAMove();
        requestAnimationFrame(animate);
    }
    animate();
}




