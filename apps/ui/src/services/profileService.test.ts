import { describe, it, expect, vi } from 'vitest';

const mockApi = { put: vi.fn() };
vi.mock('./apiClient', () => ({ api: mockApi }));

const { saveCodeLanguage } = await import('./profileService');

describe('saveCodeLanguage', () => {
  it('puts the language picked on the account', async () => {
    await saveCodeLanguage('java');
    expect(mockApi.put).toHaveBeenCalledWith('/api/profile/code-language', { language: 'java' });
  });
});
