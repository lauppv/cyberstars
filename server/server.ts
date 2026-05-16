import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import codeRoutes from "./routes/code.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import forumRoutes from "./routes/forum.routes.js";
import terminalRoutes from "./routes/terminal.routes.js";
import supportRoutes from "./routes/support.routes.js";

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api/run-code", codeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/terminal", terminalRoutes);
app.use("/api/support", supportRoutes);
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
