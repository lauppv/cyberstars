import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const isProduction = process.env.NODE_ENV === "production";

export const env = {
  isProduction,
  port: isProduction
    ? Number(process.env.PORT) || 8080
    : Number(process.env.EXPRESS_PORT) || 5000,
  corsOrigin: isProduction
    ? process.env.CORS_ORIGIN || "https://cyber-stars.org"
    : process.env.CORS_DEV_ORIGIN || "http://localhost:5173",
  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: "24h" as const,
  },
  db: {
    user: required("DB_USER"),
    host: required("DB_HOST"),
    database: required("DB_NAME"),
    password: required("DB_PASSWORD"),
    port: Number(process.env.DB_PORT) || 5432,
  },
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    maxAge: 24 * 60 * 60 * 1000,
  },
  smtp: {
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  },
} as const;
