export interface LanguageRuntime {
  name: string;
  image: string;
  pistonVersion: string;
  sourceFile: string;
  innerCmd: string;
  compileCmd?: string;
  runCmd: string;
}
