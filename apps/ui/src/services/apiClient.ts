import i18next from 'i18next';
import { localizeServerMessage } from '../i18n/serverMessages';

const API_BASE = import.meta.env.VITE_PROD_API_URL || '';

// What a status means when the answer carries no words of the server's: a
// limiter's plain-text 429, nginx's maintenance page or a down backend
const STATUS_WORDS: Record<number, string> = {
  429: 'common.tooFast',
  502: 'common.unavailable',
  503: 'common.unavailable',
};

// Makes a request. One that never reached the server becomes an error the page
// can show; an aborted one stays an abort.
export async function send(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (err) {
    if (init.signal?.aborted) throw err;
    throw new ApiClientError(0, '', i18next.t('common.unreachable'));
  }
}

// The error for an answer that isn't ok: the server's words when it gave any,
// else what its status means, else `fallback`
export async function errorOf(res: Response, fallback = 'Something went wrong') {
  let words = '';
  try {
    const data = await res.json();
    words = data.error || data.message || '';
  } catch {
    // response wasn't JSON
  }
  if (words) return new ApiClientError(res.status, words);
  const meaning = STATUS_WORDS[res.status];
  if (meaning) return new ApiClientError(res.status, '', i18next.t(meaning));
  return new ApiClientError(res.status, fallback);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await send(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) throw await errorOf(res);

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.text() as Promise<T>;
}

// `message` is what the page shows, in its language; `serverMessage` what the
// server said, for code that tells one failure from another. Status 0: the
// request never reached the server.
export class ApiClientError extends Error {
  constructor(
    public status: number,
    public serverMessage: string,
    message = localizeServerMessage(serverMessage),
  ) {
    super(message);
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
