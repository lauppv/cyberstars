import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ro from './locales/ro.json';

export const SUPPORTED_LANGS = ['en', 'ro'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

// Bumped from 'cyberstars.lang' so users with an older cached preference get
// reset to the EN default once; they can re-select RO from the topbar menu.
// The address decides the language now; this only remembers a visitor's own
// choice, so public/boot.js can send someone who picked Romanian to /ro.
const STORAGE_KEY = 'cyberstars.lang.v2';
const LEGACY_STORAGE_KEY = 'cyberstars.lang';

// Romanian pages live under /ro, English ones at the top level
export function langFromPath(pathname: string): Lang {
  return pathname === '/ro' || pathname.startsWith('/ro/') ? 'ro' : 'en';
}

// The same page in the other language: /ro/courses <-> /courses, /ro <-> /
export function twinPath(pathname: string, lang: Lang): string {
  const bare = langFromPath(pathname) === 'ro' ? pathname.slice(3) || '/' : pathname;
  if (lang === 'en') return bare;
  return bare === '/' ? '/ro' : `/ro${bare}`;
}

function initialLang(): Lang {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // localStorage unavailable (private mode), nothing to clear
  }
  return langFromPath(window.location.pathname);
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ro: { translation: ro },
  },
  lng: initialLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // ignore persistence failure
  }
});

// A language switch in the UI: the page redraws in the new language at once,
// then the browser moves to the same page on the other language's address
export function switchLanguage(lng: Lang): void {
  i18n.changeLanguage(lng);
  const { pathname, search, hash } = window.location;
  if (langFromPath(pathname) !== lng)
    window.location.assign(twinPath(pathname, lng) + search + hash);
}
