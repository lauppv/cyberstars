import { describe, it, expect, vi, beforeEach } from 'vitest';
import i18n from 'i18next';

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('i18n', () => {
  it('persists language changes to localStorage', async () => {
    const setItem = vi.fn();
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem,
      removeItem: vi.fn(),
    });

    // Side-effect import wires the languageChanged listener
    await import('./index');
    await i18n.changeLanguage('ro');

    expect(setItem).toHaveBeenCalledWith('cyberstars.lang.v2', 'ro');
  });

  it('exports SUPPORTED_LANGS', async () => {
    const mod = await import('./index');
    expect(mod.SUPPORTED_LANGS).toEqual(['en', 'ro']);
  });
});
