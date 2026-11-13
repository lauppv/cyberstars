import { auth } from '../services/auth.js';

// The sign-in checks of the auth package, as CyberStars makes it
// (services/auth.ts): a session ended or timed out is answered like one whose
// cookie expired, optionalAuth carries on as a guest, and requireAdmin reads the
// role fresh from the database
export const { authenticateToken, optionalAuth, requireAdmin } = auth;
