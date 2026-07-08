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

  it('initialises to a valid saved language and clears the legacy key', async () => {
    const removeItem = vi.fn();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => (k === 'cyberstars.lang.v2' ? 'ro' : null),
      setItem: vi.fn(),
      removeItem,
    });

    vi.resetModules();
    await import('./index');
    const i18nMod = (await import('i18next')).default;

    expect(i18nMod.language).toBe('ro');
    expect(removeItem).toHaveBeenCalledWith('cyberstars.lang');
  });

  it('falls back to English when the saved language is not supported', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => 'de',
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });

    vi.resetModules();
    await import('./index');
    const i18nMod = (await import('i18next')).default;

    expect(i18nMod.language).toBe('en');
  });

  it('falls back to English when localStorage is unavailable', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('private mode');
      },
      setItem: vi.fn(),
      removeItem: () => {
        throw new Error('private mode');
      },
    });

    vi.resetModules();
    await import('./index');
    const i18nMod = (await import('i18next')).default;

    expect(i18nMod.language).toBe('en');
  });
});
