
    document.addEventListener('DOMContentLoaded', function() {
        var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
        var ws_path = ws_scheme + '://' + window.location.host + '/ws/notifications/';
        var websocket = new WebSocket(ws_path);

        websocket.onopen = function(event) {
            console.log("WebSocket is open now.");
        };

        websocket.onclose = function(event) {
            console.log("WebSocket is closed now.");
        };

        websocket.onerror = function(event) {
            console.error("WebSocket error observed:", event);
        };

        websocket.onmessage = function(event) {
            console.log(event.data);
            var data = JSON.parse(event.data);
            // alert('Notification received from ' + data.from_user);
            handleNotification(data);
            // showToast();
        };

        function sendNotificationSocket(username){
            console.log("from : ", username);
            // You can implement WebSocket send here if needed
            // websocket.send(JSON.stringify({ 'username': username }));
        }

        document.getElementById('sendbtn').onclick = function() {
            console.log("Button clicked.");
            var pseudo = document.getElementById('inputnotif').value;
            var notificationType = document.getElementById('selectnotif').value;
            var csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            var fromUser = document.querySelector('.from_user').textContent; // Adjust this selector as needed

            if (notificationType === "") {
                console.log("Notification type is empty.");
                return;
            }

            fetch('/send_notification/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken
                },
                body: new URLSearchParams({
                    'pseudo': pseudo,
                    'notification_type': notificationType,
                    'from_user': fromUser,
                })
            }).then(response => response.json()).then(data => {
                console.log("Notification send response:", data);
                if (data.status === 'success') {
                    console.log("Notification sent successfully:", data);
                } else {
                    alert('Error sending notification: ' + data.message);
                }
            }).catch(error => {
                console.error('Fetch error:', error);
            });
        };
    });

