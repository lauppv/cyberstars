import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import authenticateToken from "./middleware/authToken.js";
import runCodeRouter from "./routes/runCode.js";
import lessonsRouter from "./routes/lessonsRouter.js"

// Încarcă variabilele din .env
dotenv.config();

const app = express();

// ===== Determinare environment =====
const isProduction = process.env.NODE_ENV === "production";

// ===== Config variabile =====
const PORT = isProduction
  ? process.env.PORT || 8080
  : process.env.EXPRESS_PORT || 5000;

const API_ORIGIN = isProduction
  ? process.env.VITE_PROD_API_URL
  : process.env.VITE_DEV_API_URL;

const DATABASE_URL = isProduction
  ? process.env.DATABASE_URL_PROD
  : process.env.DATABASE_URL;


  
app.use(
  cors({
    origin: API_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ===== API Routes =====
app.use("/auth", authRoutes);
app.use("/api/run-code", runCodeRouter);
app.use("/api", lessonsRouter);

// /auth/me pentru frontend
app.get("/auth/me", authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,  // IMPORTANT
    email: req.user.email
  });
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
