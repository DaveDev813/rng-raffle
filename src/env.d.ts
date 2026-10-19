interface ImportMetaEnv {
  readonly API_VERSION?: string;
  readonly APP_INTERNAL_API?: string;
  readonly APP_IS_SHOW_ERROR?: string | boolean;
  readonly APP_VERSION?: string;
  readonly IS_MOCK_API_ALL?: string | boolean;
  readonly MOCK_API_URL?: string;
  readonly QUASAR_PROD: boolean;
  readonly QUASAR_PWA_FALLBACK_HTML: string;
  readonly QUASAR_PWA_SERVICE_WORKER_REGEX: string;
  readonly QUASAR_SERVER: boolean;
  readonly QUASAR_SERVICE_WORKER_FILE: string;
  readonly SERVER_ENV?: string;
  readonly SERVICE_WORKER_FILE?: string;
  readonly QUASAR_VUE_ROUTER_BASE: string;
  readonly VUE_ROUTER_MODE?: 'hash' | 'history' | 'abstract';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
