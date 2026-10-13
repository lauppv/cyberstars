import type { LanguageRuntime } from './types.js';
import { pythonRuntime } from './python.js';
import { cRuntime } from './c.js';
import { javaRuntime } from './java.js';
import { kotlinRuntime } from './kotlin.js';

// Singurul loc care știe ce limbaje sunt suportate. Adaugi unul nou? Adaugi
// un fișier <lang>.ts și îl înregistrezi aici, restul codului nu se atinge
const runtimes: Record<string, LanguageRuntime> = {
  python: pythonRuntime,
  'algo-python': pythonRuntime,
  'algo-java': javaRuntime,
  'algo-c': cRuntime,
  c: cRuntime,
  java: javaRuntime,
  kotlin: kotlinRuntime,
  'algo-kotlin': kotlinRuntime,
};

export function getRuntime(language: string): LanguageRuntime | null {
  return runtimes[language.toLowerCase()] ?? null;
}
