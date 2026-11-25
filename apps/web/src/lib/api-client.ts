import {
  ApiErrorResponseSchema,
  type ApiErrorCode,
  type ApiErrorDetail,
  type ApiSuccessResponse,
} from '@eventops/contracts/common';
import { clientEnv } from '@/lib/env';
import { resolveMockResponse } from '@/lib/mocks/foundation.mock';

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: ApiErrorDetail[];

  constructor(params: {
    status: number;
    code: ApiErrorCode;
    message: string;
    details?: ApiErrorDetail[];
  }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }
}

let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

type RequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  skipAuthRefresh?: boolean;
};

async function tryRefreshSession(): Promise<boolean> {
  try {
    const res = await fetch(`${clientEnv.apiBaseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const json = (await res.json()) as Partial<
      ApiSuccessResponse<{ accessToken?: string }>
    >;
    if (json.success && json.data?.accessToken) {
      setAccessToken(json.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  if (clientEnv.useMockApi) {
    const mocked = resolveMockResponse<T>(method, path);
    if (mocked !== null) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      return mocked;
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(inMemoryAccessToken
      ? { Authorization: `Bearer ${inMemoryAccessToken}` }
      : {}),
    ...options.headers,
  };

  const response = await fetch(`${clientEnv.apiBaseUrl}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options.signal,
  });

  if (response.status === 401 && !options.skipAuthRefresh) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return request<T>(method, path, body, {
        ...options,
        skipAuthRefresh: true,
      });
    }
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccessResponse<T>
    | unknown;

  if (!response.ok) {
    const parsedError = ApiErrorResponseSchema.safeParse(payload);
    if (parsedError.success) {
      throw new ApiClientError({
        status: response.status,
        code: parsedError.data.error.code,
        message: parsedError.data.error.message,
        details: parsedError.data.error.details,
      });
    }
    throw new ApiClientError({
      status: response.status,
      code: 'INTERNAL_SERVER_ERROR',
      message:
        'Terjadi kendala saat menghubungi server EventOps. Silakan coba lagi.',
    });
  }

  return (payload as ApiSuccessResponse<T>).data;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
};
