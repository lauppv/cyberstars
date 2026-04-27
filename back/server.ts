import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api/run-code", codeRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api", lessonRoutes);

const buildPath = path.join(process.cwd(), "dist");
app.use(express.static(buildPath));

app.get(/^\/(?!api|auth).*$/, (_req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.isProduction ? "production" : "development"}`);
});
