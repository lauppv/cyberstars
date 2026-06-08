import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ro from './locales/ro.json';

export const SUPPORTED_LANGS = ['en', 'ro'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

const STORAGE_KEY = 'cyberstars.lang';

function initialLang(): Lang {
  try {
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
