import express from 'express';
import path from 'path';
import crypto from 'crypto';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
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
import hintsRoutes from './routes/hints.routes.js';
import usageRoutes from './routes/usage.routes.js';

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
// 'unsafe-inline' stays for styles only — React inline styles and CodeMirror's
// injected <style> tags need it, and inline styles are not an XSS vector.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        scriptSrc: ["'self'", 'https://unpkg.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
      },
    },
  }),
);
app.use(cors({ origin: config.corsOrigin, credentials: true }));
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
app.use('/api/hints', hintsRoutes);
app.use('/api/usage', usageRoutes);

// Authoritative server clock for the focus-radio "live" sync — clients seek to
// (serverNow % trackDuration) so everyone hears the same second regardless of
// local clock skew. No auth, no DB, cache-busting headers.
app.get('/api/time', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ now: Date.now() });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Radio audio lives OUTSIDE public/ so the 163MB mp3 isn't copied into dist/
// on every build. In production nginx serves /radio/ straight from disk and
// requests never reach here; this static mount is the dev path (and fallback).
app.use('/radio', express.static(path.join(process.cwd(), 'media/radio')));

const buildPath = path.join(process.cwd(), 'dist');
app.use(express.static(buildPath));

// SPA fallback: only match extensionless paths (course/lesson routes, profile,
// forum, etc.). Paths with a file extension (e.g. /lessons/*.md, /assets/*.js)
// should 404 — not return index.html — so the client can detect missing
// translations and fall back to English.
app.get(/^\/(?!api|auth)[^.]*$/, (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.use(errorHandler);
