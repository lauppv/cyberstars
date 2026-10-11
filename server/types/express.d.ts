import type { RateLimitInfo } from 'express-rate-limit';
import type { TokenPayload } from '../../shared/auth.js';

// authenticateToken and optionalAuth set `user`; express-rate-limit sets `rateLimit`.
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      rateLimit?: RateLimitInfo;
    }
  }
}
