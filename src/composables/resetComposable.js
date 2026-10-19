import { getActivePinia } from 'pinia';

/**
 * Global reset composable
 * - Instantiates ALL Pinia stores under `src/stores/**` (even if never used yet)
 * - Calls `store.reset()` when available, otherwise falls back to `$reset()`
 */
export function useResetComposable() {
  /**
   * Reset all stores.
   * @param {Object} opts
   * @param {boolean} opts.debug - logs what was found/reset
   */
  const resetAllStores = (opts = {}) => {
    const { debug = false } = opts;

    // 1) Eager import all store modules under src/stores
    // resetComposable.js is under src/composables -> stores is ../stores
    const storeModules = import.meta.glob('../stores/**/*.{js,ts}', {
      eager: true,
    });

    const storesToReset = [];
    const seen = new Set();

    const log = (...args) => {
      if (debug) console.log(...args);
    };

    const warn = (...args) => {
      if (debug) console.warn(...args);
    };

    const addStore = (store) => {
      if (!store) return;

      const id = store?.$id;
      const key = id || store;

      if (seen.has(key)) return;

      seen.add(key);
      storesToReset.push(store);
    };

    log(
      '[resetAllStores] storeModules found:',
      Object.keys(storeModules).length,
    );

    // 2) Instantiate stores from eager-imported modules
    Object.entries(storeModules).forEach(([path, mod]) => {
      if (!mod || typeof mod !== 'object') return;

      Object.entries(mod).forEach(([exportKey, exported]) => {
        // Match by EXPORT KEY name (not function.name)
        if (typeof exported !== 'function') return;
        if (!/^use[A-Z].*Store$/.test(exportKey)) return;

        try {
          const storeInstance = exported();
          addStore(storeInstance);
          log(
            '[resetAllStores] instantiated:',
            exportKey,
            'from',
            path,
            'id:',
            storeInstance?.$id,
          );
        } catch (err) {
          warn('[resetAllStores] store init failed:', path, exportKey, err);
        }
      });
    });

    // 3) Also include any already-instantiated stores in Pinia registry
    const pinia = getActivePinia();
    if (pinia && pinia._s) {
      pinia._s.forEach((store) => addStore(store));
    }

    log(
      '[resetAllStores] stores to reset:',
      storesToReset.map((s) => s?.$id),
    );

    // 4) Reset stores
    storesToReset.forEach((store) => {
      console.log(`[resetAllStores] resetting store: ${store?.$id}`);
      try {
        if (typeof store.reset === 'function') {
          log('[resetAllStores] calling reset():', store?.$id);
          store.reset();
          return;
        }

        if (typeof store.$reset === 'function') {
          log('[resetAllStores] calling $reset():', store?.$id);
          store.$reset();
        }
      } catch (err) {
        warn('[resetAllStores] store reset failed:', store?.$id, err);
      }
    });
  };

  return {
    resetAllStores,
  };
}
