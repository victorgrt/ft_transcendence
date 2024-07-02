function setupGame()
{
	const canvas = document.getElementById("pongCanvas");
	const ballStyle = document.getElementById("ballStyle");
	const ballSpeed = document.getElementById("ballSpeed");
	const score_P1 = document.getElementById("score_P1");
	const score_P2 = document.getElementById("score_P2");
	const ctx = canvas.getContext("2d");

	document.getElementById("ModeButton").addEventListener("click", (event) =>
	{
	// Change a parameter before restarting the game
	if (gameMode == 1)
		gameMode = 0;
	else
		gameMode = 1;

	// Reset the game
	resetBall();
	player1Paddle.score_P1 = 0;
	player2Paddle.score_P2 = 0;
	});

	document.getElementById("settingsButton").addEventListener("click", (event) =>
	{
	if (pause == 0)
		pause = 1;
	else
	{
		pause = 0;
		gameLoop();
	}
	});

	const paddleWidth = 20;
	const paddleHeight = 2000;
	const ballRadius = 10;

	let upArrowPressed = false;
	let downArrowPressed = false;
	let wPressed = false;
	let sPressed = false;

	let hue = 0;

	let gameMode = -1;
	let pause = 0;
	let winner = 0;

	document.addEventListener("keydown", (event) => {
	if (event.key == "ArrowUp")
		upArrowPressed = true;
	else if (event.key == "ArrowDown")
		downArrowPressed = true;
	if (event.key == "w")
		wPressed = true;
	else if (event.key == "s")
		sPressed = true;
	});

	document.addEventListener("keyup", (event) => {
	if (event.key == "ArrowUp")
		upArrowPressed = false;
	else if (event.key == "ArrowDown")
		downArrowPressed = false;
	if (event.key == "w")
		wPressed = false;
	if (event.key == "s")
		sPressed = false;
	});

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
		dx: 5 + (Math.random() * (5 + 3) - 3),
		dy: 5 + (Math.random() * (5 + 3) - 3),
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
	}
}
