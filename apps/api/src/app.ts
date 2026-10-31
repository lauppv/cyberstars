import express from 'express';
import crypto from 'crypto';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './config/index.js';
import { UI_BUILD_DIR, UPLOADS_DIR } from './config/paths.js';
import { errorHandler } from '@cyberstars-framework/server-kit/errors';
import { servePages } from './middleware/pages.js';
import { serveStatic } from './middleware/static.js';
import authRoutes from './routes/auth.routes.js';
import progressRoutes from './routes/progress.routes.js';
import forumRoutes from './routes/forum.routes.js';
import terminalRoutes from './routes/terminal.routes.js';
import supportRoutes from './routes/support.routes.js';
import profileRoutes from './routes/profile.routes.js';
import testsRoutes from './routes/tests.routes.js';
import dailyRoutes from './routes/daily.routes.js';
import adminRoutes from './routes/admin.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import connectionsRoutes from './routes/connections.routes.js';
import usersRoutes from './routes/users.routes.js';
import tutorRoutes from './routes/tutor.routes.js';
import usageRoutes from './routes/usage.routes.js';
import laniakeaRoutes from './routes/laniakea.routes.js';
import visitsRoutes from './routes/visits.routes.js';
import runsRoutes from './routes/runs.routes.js';

export const app = express();

// In production the app sits behind a single nginx reverse proxy
// (443 -> localhost:8080), so every request's socket address is 127.0.0.1.
// Trust exactly one proxy hop so `req.ip` (and thus the IP-keyed rate limiters
// for auth/password/forum) resolves to the real client from X-Forwarded-For
// instead of collapsing all users into one shared bucket. Off in dev/test,
// where there is no proxy and the header must not be trusted.
/* v8 ignore next -- isProduction is fixed at module load; only the dev/test branch runs under tests. */
app.set('trust proxy', config.isProduction ? 1 : false);

// Restricted CSP as defence-in-depth: scripts/objects locked to our own origin
// (plus the unpkg three.js bundle the Laniakea explorer loads at runtime), so a
// future regression that injects raw HTML can't pull in arbitrary scripts.
// 'unsafe-inline' stays for styles only: React inline styles and CodeMirror's
// injected <style> tags need it, and inline styles are not an XSS vector.
app.use(
  helmet({
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
  }),
);
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Give signed-out visitors a stable per-browser id so guest code runs are
// isolated per browser (not shared by IP) and the guest run budget can be
// tracked. The WebSocket handshake reads this cookie back.
app.use((req, res, next) => {
  if (!req.cookies?.token && !req.cookies?.guestId) {
    res.cookie('guestId', crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProduction,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
  }
  next();
});

app.use('/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/terminal', terminalRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/laniakea', laniakeaRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/runs', runsRoutes);

// The server's clock, which deploy.sh also asks to know the new backend is up.
// No auth, no DB, cache-busting headers.
app.get('/api/time', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ now: Date.now() });
});

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// Pages: only extensionless paths (lessons, courses, profile, forum, etc.), each
// its pre-rendered page, the app, or a 404. Paths with a file extension (e.g.
// /lessons/*.md, /assets/*.js) go to the static files below and 404 when
// missing (not return index.html) so the client can detect missing
// translations and fall back to English.
app.get(/^\/(?!api|auth)[^.]*$/, servePages(UI_BUILD_DIR));

app.use(serveStatic(UI_BUILD_DIR));

app.use(errorHandler);
