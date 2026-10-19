import { register } from 'register-service-worker';
import { Notify } from 'quasar';

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(
  import.meta.env.SERVICE_WORKER_FILE ||
    import.meta.env.QUASAR_SERVICE_WORKER_FILE,
  {
    // The registrationOptions object will be passed as the second argument
    // to ServiceWorkerContainer.register()
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

    // registrationOptions: { scope: './' },

    ready(/* registration */) {
      console.log('Service worker is active.');
    },

    registered(/* registration */) {
      console.log('Service worker has been registered.');
    },

    cached(/* registration */) {
      console.log('Content has been cached for offline use.');
    },

    updatefound(/* registration */) {
      console.log('New content is downloading.');

      // Notify.create({
      //   message: 'New app updates are being downloaded.',
      //   timeout: 3000,
      //   closeBtn: 'OK',
      //   color: 'secondary',
      //   position: 'top',
      //   icon: 'downloading',
      // });
    },

    updated() {
      console.log('New content is available; please refresh.');

      // Notify.create({
      //   message: 'A new version of the app has been downloaded. Please press reload to install.',
      //   timeout: 0,
      //   closeBtn: 'Reload',
      //   color: 'positive',
      //   position: 'top',
      //   icon: 'cloud_download',
      //   onDismiss () {
      //     if (registration && registration.waiting) {
      //       registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      //     }
      //     // Reload once the new SW is active
      //     window.location.reload(true)
      //   }
      // });
    },

    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.',
      );
    },

    error(err) {
      console.error('Error during service worker registration:', err);
    },
  },
);
