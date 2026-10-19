import { onScopeDispose, ref, shallowRef } from 'vue';
import { errorMessage, requestUi, UiRequestError } from '@/services/uiApi';

export function useUiRequest() {
  const data = shallowRef<unknown>();
  const loading = ref(false);
  const error = ref('');
  const errorResponse = shallowRef<unknown>();
  const loaded = ref(false);
  let requestId = 0;

  function reset() {
    requestId++;
    data.value = undefined;
    loading.value = false;
    error.value = '';
    errorResponse.value = undefined;
    loaded.value = false;
  }

  async function load(
    endpoint: string,
    params: Record<string, string | number>,
  ) {
    reset();
    const currentRequest = requestId;
    loading.value = true;
    try {
      const result = await requestUi(endpoint, params);
      if (currentRequest !== requestId) return;
      data.value = result.data;
      loaded.value = true;
    } catch (cause) {
      if (currentRequest === requestId) {
        error.value = errorMessage(cause);
        errorResponse.value =
          cause instanceof UiRequestError ? cause.responseData : undefined;
      }
    } finally {
      if (currentRequest === requestId) loading.value = false;
    }
  }

  onScopeDispose(reset);
  return { data, loading, error, errorResponse, loaded, load, reset };
}
