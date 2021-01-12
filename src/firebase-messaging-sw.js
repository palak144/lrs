importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: '214958831031' // Use my leaves account sender id
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    // console.log('Received background message ', payload);
    // here you can override some options describing what's in the message; 
    // however, the actual content will come from the Webtask
    /* const notificationOptions = {
    icon: '/assets/imgs/images.png'
    }; */
    const notificationOptions = {
        image: 'https://edgeappnew.zensar.com/sites/default/files/Annual-Report_Website-Launch.jpg',
        actions: [{
                action: 'coffee-action',
                title: 'Coffee',
                icon: '/assets/imgs/images.png'
            },
            {
                action: 'doughnut-action',
                title: 'Doughnut',
                icon: '/assets/imgs/images.png'
            },
            {
                action: 'gramophone-action',
                title: 'gramophone',
                icon: '/images/demos/action-3-128x128.png'
            },
            {
                action: 'atom-action',
                title: 'Atom',
                icon: '/images/demos/action-4-128x128.png'
            }
        ],

    };
    return self.registration.showNotification("Hello My Leaves", notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
    // console.log('On notification click: ', event.notification.tag);
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
        .then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url == '/' && 'focus' in client)
                    return client.focus();
            }
            if (clients.openWindow) {
                return clients.openWindow('https://dev-my-leaves.zensar.com/new-pwa/');
            }
        })
    );
});