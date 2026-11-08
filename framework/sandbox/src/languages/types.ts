// How a sandbox runs one language: the image its containers start from, the
// file the code is written to, and the commands that build and run it
export interface LanguageRuntime {
  name: string;
  image: string;
  sourceFile: string;
  compileCmd?: string;
  runCmd: string;
  // This language's memory and process caps, in place of the sandbox's own
  memory?: string;
  pids?: string;
}
