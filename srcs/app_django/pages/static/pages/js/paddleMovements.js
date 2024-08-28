function sendPaddleMovement(state)
{
    console.log("We are not in local");
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

function sendPaddlesMovement()
    {
        // Player 1 controls
        if ('a' in keys)
            socket.send(JSON.stringify({ action: 'move_paddle', player: 1, direction: 'left', coord: 0 }));
        else if ('d' in keys)
            socket.send(JSON.stringify({ action: 'move_paddle', player: 1, direction: 'right', coord: 0 }));
        else
            socket.send(JSON.stringify({ action: 'move_paddle', player: 1, direction: 'null', coord: 0 }));
        // Player 2 controls
        if ('ArrowLeft' in keys)
            socket.send(JSON.stringify({ action: 'move_paddle', player: 2, direction: 'left', coord: 0 }));
        else if ('ArrowRight' in keys)
            socket.send(JSON.stringify({ action: 'move_paddle', player: 2, direction: 'right', coord: 0 }));
        else
            socket.send(JSON.stringify({ action: 'move_paddle', player: 2, direction: 'null', coord: 0 }));
    }
