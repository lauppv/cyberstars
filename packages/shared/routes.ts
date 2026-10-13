// The app's pages that only make sense inside the app: sign-in, the account,
// the community and the rest. They have no pre-rendered page and stay out of
// search results; the server sends them the app, and any address that's
// neither one of these nor a pre-rendered public page gets a 404.
// Written without the /ro prefix, which the server strips first.
export const APP_ONLY_PATHS = [
  '/getstarted',
  '/profile',
  '/settings',
  '/usage',
  '/rules',
  '/support',
  '/welcome',
  '/laniakea',
  '/admin',
  '/leaderboard',
  '/messages',
  '/connections',
  '/forum',
  '/forum/c/:categorySlug',
  '/forum/t/:threadId',
  '/u/:userId',
];

export function isAppOnlyPath(pathname: string): boolean {
  const parts = pathname.split('/');
  return APP_ONLY_PATHS.some((pattern) => {
    const segments = pattern.split('/');
    return (
      segments.length === parts.length &&
      segments.every((seg, i) => (seg.startsWith(':') ? parts[i] !== '' : seg === parts[i]))
    );
  });
}
