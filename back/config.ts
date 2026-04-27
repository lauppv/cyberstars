import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const config = {
  isProduction,
  port: isProduction
    ? Number(process.env.PORT) || 8080
    : Number(process.env.EXPRESS_PORT) || 5000,
  corsOrigin: isProduction
    ? process.env.VITE_PROD_API_URL || ""
    : process.env.VITE_DEV_API_URL || "http://localhost:5173",
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret",
    expiresIn: "24h" as const,
  },
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  },
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    maxAge: 24 * 60 * 60 * 1000,
  },
} as const;
