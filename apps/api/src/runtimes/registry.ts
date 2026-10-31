import { baseLanguage } from '@cyberstars/shared/constants';
import {
  cRuntime,
  javaRuntime,
  pythonRuntime,
  type LanguageRuntime,
} from '@cyberstars-framework/sandbox/languages';

// The languages code runs in, by the name a run asks the sandbox for: the
// sandbox's own presets. The only list of them on the server
export const LANGUAGES: Record<string, LanguageRuntime> = {
  python: pythonRuntime,
  java: javaRuntime,
  c: cRuntime,
};

// The language a run goes to, from a language or a course key: an algorithm
// challenge runs in its set's language (algo-java in java)
export function languageOf(key: string): string {
  return baseLanguage(key.toLowerCase());
}

export function getRuntime(key: string): LanguageRuntime | null {
  const language = languageOf(key);
  return Object.hasOwn(LANGUAGES, language) ? LANGUAGES[language] : null;
}
