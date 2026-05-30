export interface LanguageRuntime {
  name: string;
  image: string;
  sourceFile: string;
  compileCmd?: string;
  runCmd: string;
}
