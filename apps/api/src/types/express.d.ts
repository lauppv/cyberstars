import type { RateLimitInfo } from 'express-rate-limit';

// express-rate-limit sets `rateLimit`; `user` comes with the auth package.
declare global {
  namespace Express {
    interface Request {
      rateLimit?: RateLimitInfo;
    }
  }
}
