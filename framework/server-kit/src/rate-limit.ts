import rateLimit, { type Options } from 'express-rate-limit';

export type LimiterOptions = Partial<Options> & {
  // Keeps counting in tests, for a limiter whose own tests check its limit
  alsoInTests?: boolean;
};

// Makes an app's limiters: only the standard RateLimit headers, and let through in tests
export function makeLimiter(inTests: () => boolean) {
  return ({ alsoInTests = false, ...options }: LimiterOptions) =>
    rateLimit({
      standardHeaders: true,
      legacyHeaders: false,
      ...options,
      ...(inTests() && !alsoInTests && { skip: () => true }),
    });
}
