import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import i18n from 'i18next';
import { api, ApiClientError } from './apiClient';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => vi.clearAllMocks());

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  };
}

describe('apiClient', () => {
  it('GET returns parsed JSON', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ data: 42 }));
    const result = await api.get<{ data: number }>('/api/test');
    expect(result.data).toBe(42);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ credentials: 'include' }),
    );
  });

  it('POST sends JSON body', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.post('/api/test', { name: 'Ada' });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        body: '{"name":"Ada"}',
      }),
    );
  });

  it('POST passes extra request options along', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.post('/api/test', { a: 1 }, { keepalive: true });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'POST', keepalive: true }),
    );
  });

  it('throws ApiClientError on non-2xx with error message', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ error: 'Not found' }, 404));
    try {
      await api.get('/api/missing');
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ApiClientError);
      expect((e as ApiClientError).status).toBe(404);
      expect((e as ApiClientError).message).toBe('Not found');
    }
  });

  it('throws ApiClientError with fallback message on non-JSON error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers(),
      json: () => Promise.reject(new Error('not json')),
    });
    try {
      await api.get('/api/broken');
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ApiClientError);
      expect((e as ApiClientError).message).toBe('Something went wrong');
    }
  });

  it('PUT sends body', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.put('/api/test', { code: 'x' });
    expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({ method: 'PUT' }));
  });

  it('DELETE sends request', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.delete('/api/test');
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('PATCH sends body', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.patch('/api/test', { bio: 'hi' });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'PATCH', body: '{"bio":"hi"}' }),
    );
  });

  it('POST with no body sends undefined body', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.post('/api/test');
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'POST', body: undefined }),
    );
  });

  it('uses data.message when data.error is missing', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ message: 'Validation failed' }, 422));
    try {
      await api.get('/api/x');
      expect.unreachable();
    } catch (e) {
      expect((e as ApiClientError).message).toBe('Validation failed');
    }
  });

  it('falls back to default message when error body has neither error nor message', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ unrelated: 'field' }, 500));
    try {
      await api.get('/api/x');
      expect.unreachable();
    } catch (e) {
      expect((e as ApiClientError).message).toBe('Something went wrong');
    }
  });

  it('returns text body when content-type is not JSON', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
      json: () => Promise.reject(new Error('not json')),
      text: () => Promise.resolve('plain text body'),
    });
    const result = await api.get<string>('/api/text');
    expect(result).toBe('plain text body');
  });

  it('returns text body when content-type header is missing', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: () => Promise.reject(new Error('not json')),
      text: () => Promise.resolve('raw'),
    });
    const result = await api.get<string>('/api/raw');
    expect(result).toBe('raw');
  });

  it('PUT with no body sends undefined body', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.put('/api/test');
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'PUT', body: undefined }),
    );
  });

  it('PATCH with no body sends undefined body', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.patch('/api/test');
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'PATCH', body: undefined }),
    );
  });
});

describe('apiClient when the server says nothing the page can show', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  async function failure(): Promise<ApiClientError> {
    return api.post('/api/x', { a: 1 }).then(
      () => expect.unreachable(),
      (e: unknown) => e as ApiClientError,
    );
  }

  it("says the server couldn't be reached, never the browser's words", async () => {
    mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));
    const err = await failure();
    expect(err).toBeInstanceOf(ApiClientError);
    expect(err).toMatchObject({ status: 0, serverMessage: '' });
    expect(err.message).toBe(
      "Couldn't reach CyberStars. Check your internet connection and try again.",
    );
  });

  it("says it in the page's language", async () => {
    await i18n.changeLanguage('ro');
    mockFetch.mockRejectedValue(new TypeError('Load failed'));
    expect((await failure()).message).toBe(
      'Nu am putut ajunge la CyberStars. Verifică-ți conexiunea la internet și încearcă din nou.',
    );
  });

  it('lets an aborted request stay an abort', async () => {
    const abort = new AbortController();
    abort.abort();
    const reason = new DOMException('Aborted', 'AbortError');
    mockFetch.mockRejectedValue(reason);
    await expect(api.post('/api/x', {}, { signal: abort.signal })).rejects.toBe(reason);
  });

  it("asks the student to slow down on a limiter's plain-text 429", async () => {
    mockFetch.mockResolvedValue(
      new Response('Too many requests, please try again later.', { status: 429 }),
    );
    const err = await failure();
    expect(err.status).toBe(429);
    expect(err.message).toBe("You're going too fast. Wait a minute, then try again.");
  });

  it('keeps the words of a 429 that gives them', async () => {
    mockFetch.mockResolvedValue(
      Response.json({ error: 'Too many attempts, try again later' }, { status: 429 }),
    );
    expect((await failure()).message).toBe('Too many attempts, try again later');
  });

  it.each([503, 502])('says CyberStars is unavailable on an HTML %i', async (status) => {
    mockFetch.mockResolvedValue(
      new Response('<!doctype html><title>Updating</title>', {
        status,
        headers: { 'content-type': 'text/html' },
      }),
    );
    const err = await failure();
    expect(err.status).toBe(status);
    expect(err.message).toBe(
      'CyberStars is being updated or is unavailable right now. Try again in a few minutes.',
    );
  });

  it("keeps the words of the server's own 503", async () => {
    const busy = 'The judge is busy right now, please try again in a moment';
    mockFetch.mockResolvedValue(Response.json({ error: busy }, { status: 503 }));
    expect(await failure()).toMatchObject({ status: 503, serverMessage: busy, message: busy });
  });

  it('keeps the general message for any other unreadable error', async () => {
    mockFetch.mockResolvedValue(new Response('oops', { status: 500 }));
    expect((await failure()).message).toBe('Something went wrong');
  });
});
