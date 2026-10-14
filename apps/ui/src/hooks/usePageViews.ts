import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import type { PageViewReport } from '@cyberstars/shared/visits';
import { reportPageView } from '../services/visitsService';

// The site a visit came from, as a domain, or "" when the browser sent none.
// undefined when it came from our own pages, like the reload after a language
// switch, which isn't a new visit.
export function referrerDomain(referrer: string, ownHost: string): string | undefined {
  if (!referrer) return '';
  try {
    const host = new URL(referrer).hostname;
    return host === ownHost ? undefined : host;
  } catch {
    return '';
  }
}

// Tells our own API about every page the app shows, for the visitor counts on
// the admin page. Only the first page carries where the visit came from; the
// rest were opened inside the app. A report that fails is simply dropped.
// The report waits a tick: a gate that redirects at once (a guest sent to
// sign in, a new student sent to the tour) changes the address before it
// leaves, so only the page actually seen is counted.
export function usePageViews(): void {
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // The full address, /ro included, which the router leaves out of pathname.
      const report: PageViewReport = { path: window.location.pathname };
      if (first.current) {
        first.current = false;
        const referrer = referrerDomain(document.referrer, window.location.hostname);
        if (referrer !== undefined) report.referrer = referrer;
      }
      reportPageView(report).catch(() => {});
    });
    return () => clearTimeout(timer);
  }, [pathname]);
}
