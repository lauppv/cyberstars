import { WEB_COURSE_KEYS, baseLanguage } from '@cyberstars/shared/constants';
import {
  cRuntime,
  javaRuntime,
  pythonRuntime,
  type LanguageRuntime,
} from '@cyberstars-framework/sandbox/languages';

// The web judge's sandbox (CYB-110): Node and a headless Chromium in an image
// of the app's own (runtimes/web-sandbox). A browser doesn't fit the caps
// code runs under, so it has its own, measured at about 100 MB and 45
// processes for a lesson's site. Only the judge runs in it: a web lesson has
// no editor run, its page shows in the preview.
export const WEB_LANGUAGE = 'web';
const webRuntime: LanguageRuntime = {
  name: WEB_LANGUAGE,
  image: 'cyberstars-web-sandbox',
  sourceFile: '_site.md',
  runCmd: 'false',
  memory: '384m',
  pids: '192',
};

// The languages code runs in, by the name a run asks the sandbox for: the
// sandbox's own presets, and the web judge's. The only list of them on the server
export const LANGUAGES: Record<string, LanguageRuntime> = {
  python: pythonRuntime,
  java: javaRuntime,
  c: cRuntime,
  [WEB_LANGUAGE]: webRuntime,
};

// The language a run goes to, from a language or a course key: an algorithm
// challenge runs in its set's language (algo-java in java), a web course in
// the web judge's sandbox
export function languageOf(key: string): string {
  const lower = key.toLowerCase();
  return WEB_COURSE_KEYS.includes(lower) ? WEB_LANGUAGE : baseLanguage(lower);
}

export function getRuntime(key: string): LanguageRuntime | null {
  const language = languageOf(key);
  return Object.hasOwn(LANGUAGES, language) ? LANGUAGES[language] : null;
}

// Whether the editor may run code in it: every language but the web judge's
export function isEditorLanguage(language: string): boolean {
  return language !== WEB_LANGUAGE && Object.hasOwn(LANGUAGES, language);
}
