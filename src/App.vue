<template lang="pug">
  router-view
</template>

<script setup>
// Keep vue-i18n in the main bundle; the async boot chunk currently emits
// unresolved Vite/Rolldown Vue runtime initializer calls in production.
import '@/boot/i18n';
import { useMeta } from 'quasar';

defineOptions({
  name: 'App',
});

useMeta({
  title: 'RNG Raffle',
  meta: [
    // General Meta Tags
    { charset: 'utf-8' },
    { name: 'description', content: 'RNG Raffle' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },

    // Microsoft Tiles
    { name: 'msapplication-TileColor', content: '#faab53' },
    {
      name: 'msapplication-TileImage',
      content: '/pwa-icons/ms-icon-144x144.png',
    },
  ],
  link: [
    // Favicons
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/pwa-icons/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/pwa-icons/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: '/pwa-icons/favicon-96x96.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '128x128',
      href: '/pwa-icons/favicon-128x128.png',
    },

    // Apple Touch Icons
    {
      rel: 'apple-touch-icon',
      sizes: '120x120',
      href: '/pwa-icons/apple-icon-120x120.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '152x152',
      href: '/pwa-icons/apple-icon-152x152.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '167x167',
      href: '/pwa-icons/apple-icon-167x167.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/pwa-icons/apple-icon-180x180.png',
    },

    // Apple Splash Screens
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-750x1334.png',
      media:
        '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1125x2436.png',
      media:
        '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1170x2532.png',
      media:
        '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1179x2556.png',
      media:
        '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1242x2208.png',
      media:
        '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1242x2688.png',
      media:
        '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1284x2778.png',
      media:
        '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1290x2796.png',
      media:
        '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1536x2048.png',
      media:
        '(min-device-width: 768px) and (max-device-width: 834px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1620x2160.png',
      media:
        '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1668x2224.png',
      media:
        '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-1668x2388.png',
      media:
        '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-2048x2732.png',
      media:
        '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/pwa-icons/apple-launch-828x1792.png',
      media:
        '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
    },

    // Safari Pinned Tab Icon
    {
      rel: 'mask-icon',
      href: '/pwa-icons/safari-pinned-tab.svg',
      color: '#faab53',
    },

    // Manifest File
    { rel: 'manifest', href: '/manifest.json' },
  ],
});
</script>
