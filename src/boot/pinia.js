import { defineBoot } from '#q-app';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();

// Use the persisted state plugin
pinia.use(piniaPluginPersistedstate);

export default defineBoot(({ app }) => {
  app.use(pinia);
});

export { pinia };
