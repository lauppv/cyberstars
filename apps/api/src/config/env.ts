import dotenv from 'dotenv';
import { settings } from '@cyberstars-framework/server-kit/settings';
import { ENV_FILE } from './paths.js';

dotenv.config({ path: ENV_FILE });

const { required, optional, number } = settings();

// A comma-separated list of origins, e.g. "https://a.app, https://b.app".
function originList(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const isProduction = process.env.NODE_ENV === 'production';

export const env = {
  isProduction,
  isTest: process.env.NODE_ENV === 'test',
  port: isProduction ? number('PORT', 8080) : number('EXPRESS_PORT', 5000),
  // The websites allowed to call the API (CORS) and open its WebSockets.
  allowedOrigins: originList(
    isProduction
      ? optional('CORS_ORIGIN', 'https://cyberstars.app')
      : optional('CORS_DEV_ORIGIN', 'http://localhost:5173'),
  ),
  // The signed-in session: the key its tokens are signed with, how long a
  // token and its cookie last, and the cookie over HTTPS only in production
  session: {
    secret: required('JWT_SECRET'),
    maxAgeMs: 24 * 60 * 60 * 1000,
    secureCookie: isProduction,
  },
  db: {
    user: required('DB_USER'),
    host: required('DB_HOST'),
    database: required('DB_NAME'),
    password: required('DB_PASSWORD'),
    port: number('DB_PORT', 5432),
    // A full address wins over the parts above
    url: optional('DATABASE_URL', ''),
  },
  // The account that always signs up as the founder
  founderEmail: optional('FOUNDER_EMAIL', ''),
  resend: {
    apiKey: optional('RESEND_API_KEY', ''),
    from: optional('RESEND_FROM', 'CyberStars <noreply@cyberstars.app>'),
  },
  gemini: {
    apiKey: optional('GEMINI_API_KEY', ''),
    model: optional('GEMINI_MODEL', 'gemini-flash-lite-latest'),
  },
} as const;
