import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import authenticateToken from "./middleware/authToken.js";
import runCodeRouter from "./routes/runCode.js";

// Încarcă variabilele din .env
dotenv.config();

const app = express();

// ===== Determinare environment =====
const isProduction = process.env.NODE_ENV === "production";

// ===== Config variabile =====
const PORT = isProduction
  ? process.env.EXPRESS_PORT_PROD || 8080
  : process.env.EXPRESS_PORT || 3000;

const API_ORIGIN = isProduction
  ? process.env.VITE_PROD_API_URL
  : process.env.VITE_DEV_API_URL;

const DATABASE_URL = isProduction
  ? process.env.DATABASE_URL_PROD
  : process.env.DATABASE_URL;

// ===== Middleware =====
if (!isProduction) {
  // CORS doar pe development
  app.use(
    cors({
      origin: API_ORIGIN,
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(cookieParser());

// ===== API Routes =====
app.use("/auth", authRoutes);
app.use("/api/run-code", runCodeRouter);

// Protected routes (dashboard)
app.use("/api", authenticateToken, (req, res, next) => {
  if (req.path === "/dashboard") {
    return res.json({ message: `Welcome user ${req.user.id}` });
  }
  next();
});

// ===== Lessons endpoint =====
app.get("/lessons/:lang/:lesson", (req, res) => {
  const { lang, lesson } = req.params;
  const filePath = path.join(process.cwd(), "back", "lessons", lang, `${lesson}.md`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Lesson not found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.json({ title: lesson, content });
});

// ===== Lesson code endpoint =====
app.get("/lesson-code/:lang/:file", (req, res) => {
  const { lang, file } = req.params;
  const filePath = path.join(process.cwd(), "back", "lessons", lang, file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Code file not found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.type("text/plain").send(content);
});

// ===== Serve React build =====
const buildPath = path.join(process.cwd(), "dist");
app.use(express.static(buildPath));

// ===== SPA Fallback =====
app.get(/^\/(?!api|auth|lessons|lesson-code).*$/, (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${isProduction ? "production" : "development"}`);
  console.log(`API Origin: ${API_ORIGIN}`);
  console.log(`Database URL: ${DATABASE_URL}`);
});
