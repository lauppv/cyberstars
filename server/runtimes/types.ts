export interface LanguageRuntime {
  name: string;
  image: string;
  pistonVersion: string;
  sourceFile: string;
  compileCmd?: string;
  runCmd: string;
}
