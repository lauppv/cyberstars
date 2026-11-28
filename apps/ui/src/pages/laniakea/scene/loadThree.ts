// three.js ships with the site as a chunk of its own, so it stays out of the
// app's bundle and is fetched only by students who open the game; a second
// visit reuses it. The site's CSP lets scripts come only from the site, so
// nothing else could be loaded in its place (CYB-144).
let loading: Promise<typeof import('three')> | null = null;

export function loadThree(): Promise<typeof import('three')> {
  loading ??= import('three').catch((error: unknown) => {
    // Lets the next visit try again, after a dropped connection
    loading = null;
    throw error;
  });
  return loading;
}
