import { defineBoot } from '#q-app';
import axios, { AxiosInstance } from 'axios';
import { Notify, Loading } from 'quasar';

const APP_IS_SHOW_ERROR = String(import.meta.env.APP_IS_SHOW_ERROR) === 'true';
const APP_INTERNAL_API = import.meta.env.APP_INTERNAL_API;
const IS_MOCK_API_ALL = String(import.meta.env.IS_MOCK_API_ALL) === 'true';
const MOCK_API_URL = import.meta.env.MOCK_API_URL;

function parseResponseData(data: unknown) {
  if (typeof data !== 'string') {
    return data;
  }

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

function getErrorMessage(data: unknown, fallback = 'Error') {
  const parsedData = parseResponseData(data);

  if (typeof parsedData === 'string') {
    return parsedData || fallback;
  }

  if (!parsedData || typeof parsedData !== 'object') {
    return fallback;
  }

  const responseData = parsedData as {
    message?: unknown;
    error?: unknown;
    param_errors?: Record<string, unknown>;
  };

  if (typeof responseData.message === 'string' && responseData.message) {
    return responseData.message;
  }

  const firstParamError = Object.values(responseData.param_errors || {})[0];
  if (typeof firstParamError === 'string' && firstParamError) {
    return firstParamError;
  }

  return fallback;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: IS_MOCK_API_ALL ? MOCK_API_URL : APP_INTERNAL_API,
});

api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response

    response.data = parseResponseData(response.data);

    const { error, message } = response.data;

    if (error) {
      Notify.create({
        type: 'warning',
        textColor: 'white',
        message,
      });
    }

    return response;
  },
  (error) => {
    const config = error.config || {};
    const responseStatus = error.response?.status;
    if (
      error.code == 'ERR_NETWORK' ||
      error.code == 'ECONNABORTED' ||
      (typeof responseStatus === 'number' && responseStatus >= 500)
    ) {
      Loading.hide();

      console.error(
        '%c NETWORK ERROR: ',
        'background-color: #f00; font-weight: bolder; color: #fff',
        error,
      );

      error.isServerError = true; // custom flag to the error

      if (!config.skipGlobalErrorHandler) {
        const message = getErrorMessage(error.response?.data, error.message);

        if (APP_IS_SHOW_ERROR) {
          Notify.create({
            type: 'negative',
            multiLine: true,
            message: `${message}: ${config.url || 'Unknown endpoint'}`,
            icon: 'error',
          });
        } else {
          Notify.create({
            type: 'negative',
            message,
            icon: 'error',
          });
        }
      }

      return Promise.reject(error);
    } else {
      console.log(
        '%c WARNING: ',
        'background-color: #ff9033; font-weight: bolder; color: #000',
        error.message,
        error.config.url,
      );
    }

    return error.response;
  },
);

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
