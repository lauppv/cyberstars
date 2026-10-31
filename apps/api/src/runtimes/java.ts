import type { LanguageRuntime } from './types.js';

// Student programs are short-lived, so JVM startup dominates a run. C1-only JIT
// and the serial GC start noticeably faster under the fractional CPU cap; the
// lesson judge runs its programs, its runner and the runner's javac with the
// same flags.
export const FAST_START = '-XX:TieredStopAtLevel=1 -XX:+UseSerialGC';
export const FAST_START_JAVAC = '-J-XX:TieredStopAtLevel=1 -J-XX:+UseSerialGC';

export const javaRuntime: LanguageRuntime = {
  name: 'java',
  image: 'eclipse-temurin:21-jdk-alpine',
  sourceFile: 'Main.java',
  compileCmd: `javac ${FAST_START_JAVAC} /work/Main.java -d /work`,
  runCmd: `stdbuf -o0 java ${FAST_START} -cp /work Main`,
  // The lesson judge holds two JVMs at once (runner with in-process javac +
  // the judged program); the 128m default gets the child OOM-killed.
  memory: '256m',
};
