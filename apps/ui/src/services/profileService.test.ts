import { describe, it, expect, vi, afterEach } from 'vitest';

const mockApi = { put: vi.fn() };
vi.mock('./apiClient', async (actual) => ({
  ...(await actual<typeof import('./apiClient')>()),
  api: mockApi,
}));

const { saveCodeLanguage, uploadAvatar } = await import('./profileService');

describe('saveCodeLanguage', () => {
  it('puts the language picked on the account', async () => {
    await saveCodeLanguage('java');
    expect(mockApi.put).toHaveBeenCalledWith('/api/profile/code-language', { language: 'java' });
  });
});

describe('uploadAvatar', () => {
  const fetchMock = vi.fn();
  const file = new File(['x'], 'me.png', { type: 'image/png' });

  afterEach(() => vi.unstubAllGlobals());

  it('leaves the message empty when the server gives no reason', async () => {
    vi.stubGlobal('fetch', fetchMock.mockResolvedValue(new Response('', { status: 500 })));
    await expect(uploadAvatar(file)).rejects.toMatchObject({ status: 500, message: '' });
  });

  it("says the server couldn't be reached", async () => {
    vi.stubGlobal('fetch', fetchMock.mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(uploadAvatar(file)).rejects.toMatchObject({
      status: 0,
      message: "Couldn't reach CyberStars. Check your internet connection and try again.",
    });
  });
});
