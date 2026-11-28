import { makeLimiter } from '@cyberstars-framework/server-kit/rate-limit';
import { config } from '../config/index.js';

// Every limiter of the API; tests go through them unless one says otherwise
export const limiter = makeLimiter(() => config.isTest);
