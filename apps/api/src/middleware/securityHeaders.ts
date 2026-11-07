import type { RequestHandler } from 'express';
import helmet from 'helmet';
import { WEB_PREVIEW_PATH } from '@cyberstars/shared/webFiles';

// Restricted CSP as defence-in-depth: scripts/objects locked to our own origin
// (plus the unpkg three.js bundle the Laniakea explorer loads at runtime), so a
// future regression that injects raw HTML can't pull in arbitrary scripts.
// 'unsafe-inline' stays for styles only: React inline styles and CodeMirror's
// injected <style> tags need it, and inline styles are not an XSS vector.
const siteHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      scriptSrc: ["'self'", 'https://unpkg.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      // The fonts ship with the app, so nothing is fetched from a font host.
      fontSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
    },
  },
});
// A web lesson's preview (CYB-109) runs the student's page, which a real
// site would let have inline scripts, onclick attributes and requests to
// other addresses. A frame made from the lesson page would inherit the
// policy above and refuse them, so the preview is a file of its own with a
// policy of its own: open for the page's code, sandboxed so the page has an
// origin of its own (never ours, even opened on its own), and framed only by
// our pages. The lesson's iframe sandboxes it the same way.
const previewHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'unsafe-inline'", "'unsafe-eval'", 'blob:', 'data:', 'https:'],
      styleSrc: ["'unsafe-inline'", 'data:', 'blob:', 'https:'],
      imgSrc: ['data:', 'blob:', 'https:'],
      mediaSrc: ['data:', 'blob:', 'https:'],
      fontSrc: ['data:', 'https:'],
      connectSrc: ['https:'],
      formAction: ["'none'"],
      baseUri: ["'none'"],
      frameAncestors: ["'self'"],
      sandbox: ['allow-scripts', 'allow-forms', 'allow-modals'],
    },
  },
});
// Each response gets the policy of what it is
export const securityHeaders: RequestHandler = (req, res, next) =>
  (req.path === WEB_PREVIEW_PATH ? previewHeaders : siteHeaders)(req, res, next);
