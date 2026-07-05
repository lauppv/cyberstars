import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ro from './locales/ro.json';

export const SUPPORTED_LANGS = ['en', 'ro'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

// Bumped from 'cyberstars.lang' so users with an older cached preference get
// reset to the EN default once; they can re-select RO from the topbar menu.
const STORAGE_KEY = 'cyberstars.lang.v2';
const LEGACY_STORAGE_KEY = 'cyberstars.lang';

function initialLang(): Lang {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (SUPPORTED_LANGS as readonly string[]).includes(saved)) return saved as Lang;
  } catch {
    // localStorage unavailable (private mode) — fall back to default
  }
  return 'en';
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
