import type { LanguageRuntime } from './types.js';

export const kotlinRuntime: LanguageRuntime = {
  name: 'kotlin',
  image: 'danysk/kotlin:latest',
  sourceFile: 'Main.kt',
  compileCmd: 'kotlinc -include-runtime -d /work/Main.jar /work/Main.kt',
  runCmd: 'stdbuf -o0 java -jar /work/Main.jar',
};
