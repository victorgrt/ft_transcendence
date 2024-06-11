const canvas = document.getElementById("pongCanvas");
const ballSpeed = document.getElementById("ballSpeed");
const score_P1 = document.getElementById("score_P1");
const score_P2 = document.getElementById("score_P2");
const ctx = canvas.getContext("2d");
document.getElementById("restartButton").addEventListener("click", (event) => {
  // Change a parameter before restarting the game
  if (gameMode == 1)
    gameMode = 0;
  else
    gameMode = 1;

  // Reset the game
  resetBall();
  playerPaddle.score_P1 = 0;
  computerPaddle.score_P2 = 0;
});

const paddleWidth = 20;
const paddleHeight = 200;
const ballRadius = 10;

let upArrowPressed = false;
let downArrowPressed = false;

const paddleSpeed = 8;
let playerPaddle = {
  score_P1: 0,
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  // coord :
  // {
  //     xA : playerPaddle.x - paddleHeight / 2,
  //     xB : playerPaddle.x + paddleHeight / 2,
  //     yA : playerPaddle.y - paddleHeight / 2,
  //     yB : playerPaddle.y + paddleHeight / 2,
  // },
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

let computerPaddle = {
  score_P2: 0,
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 4,
  phi: 0.6,
};

let ball = {
  speedVector:
  {//Math. random() * (max - min) + min
    dx: 5 + (Math.random() * (2 + 2) - 2),
    dy: 5 + (Math.random() * (2 + 2) - 2),
  },
  positionVector: {
    x: canvas.width / 2,
    y: canvas.height / 2,
  },
  // frictionVector :
  // {
  //   xF : ,
  //   yF : ,
  // }
  phi: 0.4,
  radius: ballRadius,
  //speed: 4,
};

function drawPaddle(x, y, width, height) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, radius) {
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawField() {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  // Effacer le canvas
  // context.clearRect(0, 0, width, height);

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
  // Handle paddle move
  if (upArrowPressed && playerPaddle.y > 0) {
    playerPaddle.y -= paddleSpeed;
  } else if (downArrowPressed && (playerPaddle.y < canvas.height - paddleHeight)) {
    playerPaddle.y += paddleSpeed;
  }


  //Handle Computer paddle move
  if (gameMode == 0)
  {
    computerPaddle.y += computerPaddle.dy;
    if (computerPaddle.y <= 0 || computerPaddle.y + paddleHeight >= canvas.height) {
      computerPaddle.dy *= -1;
    }
  }
  else
  {
    //if (wPressed && player2Paddle.y > 0)
      //player2Paddle -= paddleSpeed;
    //else if (sPressed && player2Paddle.y < canvas.height - paddleHeight)
      //player2Paddle.y += paddleSpeed;
  }

  // Move the ball
  ball.positionVector.x += ball.speedVector.dx;
  ball.positionVector.y += ball.speedVector.dy;

  // Handle collision with walls
  if (ball.positionVector.y + ball.radius >= canvas.height || ball.positionVector.y - ball.radius <= 0) {
    ball.speedVector.dy *= -1;
    // ball.speed = ball.speed + 0.2;
  }

  // Handle collision with paddle
  if (ball.positionVector.x - ball.radius <= playerPaddle.x + paddleWidth && ball.positionVector.y >= playerPaddle.y && ball.positionVector.y <= playerPaddle.y + paddleHeight)
  {
    // need to add the difference between -1 and cone de frotement
    ball.speedVector.dx -= 0.2;
    ball.speedVector.dx *= -1;
  }
  if (ball.positionVector.x + ball.radius >= computerPaddle.x && ball.positionVector.y >= computerPaddle.y && ball.positionVector.y <= computerPaddle.y + paddleHeight)
  {
    ball.speedVector.dx += 0.2;
    ball.speedVector.dx *= -1;
  }

  ballSpeed.textContent = Math.round(ball.speedVector.dx * 100) / 100;

  // Detect goal
  if (ball.positionVector.x - ball.radius <= 0)
  {
    computerPaddle.score_P2 += 1;
    score_P2.textContent = computerPaddle.score_P2;
    resetBall(1);
  } else if (ball.positionVector.x + ball.radius >= canvas.width)
  {
    playerPaddle.score_P1 += 1;
    score_P1.textContent = playerPaddle.score_P1;
    resetBall(2);
  }
}

function resetBall(x)
{
  ball.positionVector.x = canvas.width / 2;
  ball.positionVector.y = canvas.height / 2;
  ball.speedVector.dx = 5 + (Math.random() * (2 + 2) - 2);
  ball.speedVector.dy = 5 + (Math.random() * (2 + 2) - 2);
  if (x == 2)
    ball.speedVector.dx *= -1;
}

function draw()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawField();
  drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
  drawPaddle(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height);
  //drawEngagement
  //wait endEngagement
  drawBall(ball.positionVector.x, ball.positionVector.y, ball.radius);
}

function gameLoop()
{
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    upArrowPressed = true;
  } else if (event.key == "ArrowDown") {
    downArrowPressed = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key == "ArrowUp") {
    upArrowPressed = false;
  } else if (event.key == "ArrowDown") {
    downArrowPressed = false;
  }
});

gameLoop();
