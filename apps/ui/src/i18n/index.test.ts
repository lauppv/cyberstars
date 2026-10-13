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

  it('reads the language from the address and clears the legacy key', async () => {
    const removeItem = vi.fn();
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: vi.fn(), removeItem });
    window.history.replaceState(null, '', '/ro/courses');

    vi.resetModules();
    await import('./index');
    const i18nMod = (await import('i18next')).default;

    expect(i18nMod.language).toBe('ro');
    expect(removeItem).toHaveBeenCalledWith('cyberstars.lang');
    window.history.replaceState(null, '', '/');
  });

  it('stays in English on an English address, whatever was picked before', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => 'ro',
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });

    vi.resetModules();
    await import('./index');
    const i18nMod = (await import('i18next')).default;

    expect(i18nMod.language).toBe('en');
  });

  it('still starts when localStorage is unavailable', async () => {
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

describe('language addresses', () => {
  it('tells the language from the address', async () => {
    const { langFromPath } = await import('./index');
    expect(langFromPath('/')).toBe('en');
    expect(langFromPath('/ro')).toBe('ro');
    expect(langFromPath('/ro/lesson/python/print')).toBe('ro');
    expect(langFromPath('/robots')).toBe('en');
  });

  it('finds the same page in the other language', async () => {
    const { twinPath } = await import('./index');
    expect(twinPath('/courses', 'ro')).toBe('/ro/courses');
    expect(twinPath('/', 'ro')).toBe('/ro');
    expect(twinPath('/ro/courses', 'en')).toBe('/courses');
    expect(twinPath('/ro', 'en')).toBe('/');
    expect(twinPath('/ro/courses', 'ro')).toBe('/ro/courses');
    expect(twinPath('/courses', 'en')).toBe('/courses');
  });

  it('switches language and moves to the twin address', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { pathname: '/courses', search: '?open=c', hash: '', assign });
    const { switchLanguage } = await import('./index');

    switchLanguage('ro');

    expect(i18n.language).toBe('ro');
    expect(assign).toHaveBeenCalledWith('/ro/courses?open=c');
    await i18n.changeLanguage('en');
  });

  it('stays put when the address already has that language', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { pathname: '/ro/courses', search: '', hash: '', assign });
    const { switchLanguage } = await import('./index');

    switchLanguage('ro');

    expect(assign).not.toHaveBeenCalled();
    await i18n.changeLanguage('en');
  });
});
