import { localizeServerMessage } from '../i18n/serverMessages';

const API_BASE = import.meta.env.VITE_PROD_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let message = 'Something went wrong';
    try {
      const data = await res.json();
      message = data.error || data.message || message;
    } catch {
      // response wasn't JSON
    }
    throw new ApiClientError(res.status, message);
  }

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.text() as Promise<T>;
}

// `message` is what the page shows, in its language; `serverMessage` what the
// server said, for code that tells one failure from another
export class ApiClientError extends Error {
  constructor(
    public status: number,
    public serverMessage: string,
  ) {
    super(localizeServerMessage(serverMessage));
    this.name = 'ApiClientError';
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
