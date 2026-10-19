// public/firebase-messaging-sw.js
importScripts(
  'https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js',
);

console.log('RUNNING SERVICE WORKER');

firebase.initializeApp({
  apiKey: 'AIzaSyDc3-aKR3Pj661qq_gfDkZoOsCL6fUDjEM',
  authDomain: 'ag-push-notifications-c39ae.firebaseapp.com',
  projectId: 'ag-push-notifications-c39ae',
  storageBucket: 'ag-push-notifications-c39ae.firebasestorage.app',
  messagingSenderId: '70554860970',
  appId: '1:70554860970:web:399d701c90327cd9303fd3',
  measurementId: 'G-PJ4F20RVV9',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    'SERVICE WORKER! onBackgroundMessage - Received background message: ',
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body,
    icon: '/pwa-icons/icon-512x512.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const payload = event.data.json();

  console.log('🚀 ~ self.addEventListener ~ payload:', payload, event);

  const title = payload.data.title || 'Alert!';

  const options = {
    body: payload.data.body || '',
    icon: '/pwa-icons/icon-512x512.png',
    data: {
      url: payload.data.click_action || '/',
    },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url;

  console.log('SERVICE WORKER! addEventListener notificationclick', event);

  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
