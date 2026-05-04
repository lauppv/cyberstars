// Descrie un limbaj suportat de runner. Tot ce ține de un limbaj nou (imagine
// docker, versiune piston, comanda de build/run) trăiește într-un singur fișier
export interface LanguageRuntime {
  name: string;
  image: string;
  pistonVersion: string;
  sourceFile: string;
  // Comanda rulată în interiorul containerului. Are acces la căile fixe:
  //   /work/<sourceFile>, /work/stdin.txt, /work/output.txt
  innerCmd: string;
}
