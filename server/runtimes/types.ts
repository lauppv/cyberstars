export interface LanguageRuntime {
  name: string;
  image: string;
  sourceFile: string;
  compileCmd?: string;
  runCmd: string;
  memory?: string;
  // Per-language CPU cap for the run container. Omit to use the default cap
  // (CODE_RUN_CPUS); set to null to run uncapped (e.g. Kotlin, whose
  // -include-runtime compile is too heavy to fit a fractional-CPU budget).
  cpus?: string | null;
}
