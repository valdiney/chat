Notification.requestPermission().then(function(result) {
    if (result === 'denied') {
        console.log('Permission wasn\'t granted. Allow a retry.');

        var ref = firebase.database().ref("chat");

        ref.on("child_added", function(snapshot) {
            showNotification(snapshot.val().msg);
        });

        return;
    }

    if (result === 'default') {
        console.log('The permission request was dismissed.');
        return;
    }

    navigator.serviceWorker.register('sw.js');

   
});

function showNotification(message) {
    Notification.requestPermission(function(result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(snapshot.val().user, {
                body: message,
                icon: 'https://www.searchpng.com/wp-content/uploads/2019/02/Message-Chat-Icon-PNG-Image-715x657.png',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'vibration-sample'
                });
            });
        }
    });
}