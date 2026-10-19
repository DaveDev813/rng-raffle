# Quasar Pug Typescript (quasar-pug-typescript)

Boiler plate project for Vue js

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Deploy the PWA to Firebase Hosting

Run these commands from the project root:

```bash
npm run buildpwa
firebase deploy --only hosting
```

Firebase Hosting uses `dist/pwa` as its public directory. The build uses `/`
as its public URL path because Firebase serves those files at the site root.
Only set `QUASAR_PUBLIC_PATH` when deploying under a URL subdirectory.

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js)
