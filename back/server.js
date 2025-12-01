import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import authenticateToken from "./middleware/authToken.js";
import runCodeRouter from "./routes/runCode.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
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

// Lessons endpoint
app.get("/lessons/:lang/:lesson", (req, res) => {
  const { lang, lesson } = req.params;
  const filePath = path.join(process.cwd(), "back", "lessons", lang, `${lesson}.md`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Lesson not found" });
  const content = fs.readFileSync(filePath, "utf-8");
  res.json({ title: lesson, content });
});

// ===== Serve React Build =====
const buildPath = path.join(process.cwd(), "dist");
app.use(express.static(buildPath));

// ===== SPA Fallback =====
// Toate rutele care nu sunt /api, /auth sau /lessons trimit index.html
app.get(/^\/(?!api|auth|lessons).*$/, (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || process.env.EXPRESS_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
