import { defineRouter } from '#q-app';
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : createWebHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Configure the deployment base through quasar.config.js > build > publicPath.
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  return Router;
});
