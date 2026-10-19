import { copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import { defineConfig } from '#q-app';
import checker from 'vite-plugin-checker';
import pugPlugin from 'vite-plugin-pug';

const __dirname = dirname(fileURLToPath(import.meta.url));

function injectPwaMetaTags({ publicPath, pwaManifest }) {
  const iconBase = `${publicPath}pwa-icons`;
  const themeColor = pwaManifest.theme_color;

  return (
    (themeColor !== undefined
      ? `<meta name="theme-color" content="${themeColor}">` +
        `<link rel="mask-icon" href="${iconBase}/safari-pinned-tab.svg" color="${themeColor}">`
      : '') +
    '<meta name="mobile-web-app-capable" content="yes">' +
    '<meta name="apple-mobile-web-app-status-bar-style" content="default">' +
    (pwaManifest.name !== undefined
      ? `<meta name="apple-mobile-web-app-title" content="${pwaManifest.name}">`
      : '') +
    `<meta name="msapplication-TileImage" content="${iconBase}/ms-icon-144x144.png">` +
    `<meta name="msapplication-TileColor" content="${themeColor ?? '#000000'}">` +
    `<link rel="apple-touch-icon" href="${iconBase}/apple-icon-120x120.png">` +
    `<link rel="apple-touch-icon" sizes="152x152" href="${iconBase}/apple-icon-152x152.png">` +
    `<link rel="apple-touch-icon" sizes="167x167" href="${iconBase}/apple-icon-167x167.png">` +
    `<link rel="apple-touch-icon" sizes="180x180" href="${iconBase}/apple-icon-180x180.png">`
  );
}

export default defineConfig(function (ctx) {
  return {
    boot: ['i18n', 'axios', 'pinia', 'app-setup', 'capacitor', 'global-splash'],

    css: ['app.scss'],

    extras: ['roboto-font', 'material-icons'],

    build: {
      // Firebase Hosting serves dist/pwa at the site root.
      publicPath:
        ctx.prod && ctx.mode.pwa
          ? import.meta.env.QUASAR_PUBLIC_PATH || '/'
          : '/',

      env: {
        folder: '..',
        file: ['.env.frontend'],
        clientPrefix: [
          'API_',
          'APP_',
          'IS_',
          'MOCK_',
          'PUSH_',
          'SERVER_',
          'SERVICE_',
          'VAPID_',
        ],
      },

      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node24',
      },

      typescript: {
        vueShim: true,
      },

      vueOptionsAPI: true,

      vueRouterMode: 'history',

      vitePlugins: [
        vueI18n({
          include: resolve(__dirname, './src/i18n/**'),
        }),
        [checker({}), { server: false }],
        {
          name: 'copy-pdf-worker',
          apply: 'build',
          configResolved() {
            copyFileSync(
              resolve(
                __dirname,
                'node_modules/pdfjs-dist/build/pdf.worker.mjs',
              ),
              resolve(__dirname, 'public/pdf.worker.mjs'),
            );
          },
        },
        pugPlugin(),
      ],
    },

    devServer: {
      open: true,
    },

    framework: {
      config: {},
      plugins: [
        'Loading',
        'Notify',
        'LocalStorage',
        'SessionStorage',
        'Dialog',
        'Meta',
      ],
    },

    animations: [],

    sourceFiles: {
      pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
      pwaServiceWorker: 'src-pwa/sw/custom-service-worker',
    },

    ssr: {
      pwa: true,
      prodPort: 3000,
      middlewares: ['render'],
    },

    pwa: {
      workboxMode: 'InjectManifest',
      injectPWAMetaTags: injectPwaMetaTags,
      extendPWACustomSWConf(rolldownConf) {
        rolldownConf.output = {
          ...rolldownConf.output,
          generatedCode: {
            ...rolldownConf.output?.generatedCode,
            preset: 'es2015',
          },
        };
      },
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'AG-Interpreter-App',
      },
    },

    bex: {
      contentScripts: ['my-content-script'],
    },
  };
});
