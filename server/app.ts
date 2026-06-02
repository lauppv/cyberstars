import express from 'express';
import path from 'path';
import crypto from 'crypto';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import progressRoutes from './routes/progress.routes.js';
import forumRoutes from './routes/forum.routes.js';
import terminalRoutes from './routes/terminal.routes.js';
import supportRoutes from './routes/support.routes.js';
import profileRoutes from './routes/profile.routes.js';

export const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
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
app.use('/api', lessonRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const buildPath = path.join(process.cwd(), 'dist');
app.use(express.static(buildPath));

app.get(/^\/(?!api|auth).*$/, (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.use(errorHandler);
