function handleKeyDownLoc(e) {
	keys[e.key] = true;
	sendPaddlesMovement("down");
}

function handleKeyUpLoc(e) {
	delete keys[e.key];
	sendPaddlesMovement("up");
}

function handleKeyDown(e) {
    keys[e.key] = true;
    sendPaddleMovement("down");
}

function handleKeyUp(e) {
    delete keys[e.key];
    sendPaddleMovement("up");
}
