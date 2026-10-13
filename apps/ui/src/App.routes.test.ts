import { describe, it, expect } from 'vitest';
import { APP_ONLY_PATHS } from '@cyberstars/shared/routes';
import app from './App.tsx?raw';

// The routes the build pre-renders a page for (see src/seo/pages.ts), and the
// not-found page that takes everything else
const PUBLIC_PATHS = [
  '/',
  '/courses',
  '/courses/:course',
  '/algorithms',
  '/algorithms/:lang',
  '/lesson/:category/:lesson',
  '/almanac',
  '/almanac/:slug',
  '*',
];

// The server answers 404 for an address that's neither pre-rendered nor in
// APP_ONLY_PATHS, so a new page left out of both would vanish in production
describe('the routes in App.tsx', () => {
  it('are each either a public page or an app-only one', () => {
    const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
    expect(routes.length).toBeGreaterThan(20);
    const known = new Set([...PUBLIC_PATHS, ...APP_ONLY_PATHS]);
    expect(routes.filter((r) => !known.has(r))).toEqual([]);
  });
});
