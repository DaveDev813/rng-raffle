import { api } from '@/boot/axios';
import { isAxiosError } from 'axios';

export type UiResponse = {
  error: boolean;
  message: string;
  data: unknown;
  param_error: unknown;
  [key: string]: unknown;
};

export class UiRequestError extends Error {
  constructor(
    message: string,
    public responseData?: unknown,
  ) {
    super(message);
    this.name = 'UiRequestError';
  }
}

function parseResponse(data: unknown): unknown {
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

function responseMessage(data: unknown, fallback: string): string {
  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof data.message === 'string' &&
    data.message
  )
    return data.message;
  return fallback;
}

function hasParamError(value: unknown): boolean {
  return value !== null && typeof value === 'object'
    ? Object.keys(value).length > 0
    : Boolean(value);
}

export function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Unable to load data. Please try again.';
}

// APP_INTERNAL_API already includes the backend's /ui group.
export async function requestUi(
  endpoint: string,
  params?: Record<string, string | number>,
): Promise<UiResponse> {
  let response;
  try {
    response =
      params === undefined
        ? await api.get<UiResponse>(endpoint)
        : await api.post<UiResponse>(endpoint, params);
  } catch (cause) {
    const responseData = isAxiosError(cause)
      ? parseResponse(cause.response?.data)
      : undefined;
    throw new UiRequestError(
      responseMessage(responseData, errorMessage(cause)),
      responseData,
    );
  }

  const responseData = parseResponse(response?.data) as UiResponse | undefined;

  // The shared Axios interceptor also resolves some HTTP error responses.
  if (
    !response ||
    !responseData ||
    response.status >= 400 ||
    responseData?.error ||
    hasParamError(responseData?.param_error)
  ) {
    throw new UiRequestError(
      responseMessage(responseData, 'Unable to load data. Please try again.'),
      responseData,
    );
  }
  return responseData;
}
