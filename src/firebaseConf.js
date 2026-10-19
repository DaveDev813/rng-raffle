// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDc3-aKR3Pj661qq_gfDkZoOsCL6fUDjEM',
  authDomain: 'ag-push-notifications-c39ae.firebaseapp.com',
  projectId: 'ag-push-notifications-c39ae',
  storageBucket: 'ag-push-notifications-c39ae.firebasestorage.app',
  messagingSenderId: '70554860970',
  appId: '1:70554860970:web:399d701c90327cd9303fd3',
  measurementId: 'G-PJ4F20RVV9',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };
