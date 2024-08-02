function handleKeyDown(e) {
    keys[e.key] = true;
    sendPaddleMovement("down");
}

function handleKeyUp(e) {
    delete keys[e.key];
    sendPaddleMovement("up");
}

function sendPaddleMovement(state)
{
    if (state == "up")
        socket.send(JSON.stringify({ action: 'move_paddle', player: id, direction: 'null', coord: 0 }));
    if ('a' in keys)
        socket.send(JSON.stringify({ action: 'move_paddle', player: id, direction: 'left', coord: 0 }));
    else if ('d' in keys)
        socket.send(JSON.stringify({ action: 'move_paddle', player: id, direction: 'right', coord: 0 }));
    else if ('ArrowLeft' in keys)
        socket.send(JSON.stringify({ action: 'move_paddle', player: id, direction: 'left', coord: 0 }));
    else if ('ArrowRight' in keys)
        socket.send(JSON.stringify({ action: 'move_paddle', player: id, direction: 'right', coord: 0 }));
}
