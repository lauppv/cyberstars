import { describe, it, expect, vi, beforeEach } from 'vitest';
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
