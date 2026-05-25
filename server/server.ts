import { app } from "./app.js";
import { config } from "./config/index.js";
import { destroyAllSessions } from "./services/terminal-session.service.js";
import { WebSocketServer } from "ws";
import { handleInteractiveRun } from "./services/interactive-execution.service.js";

const server = app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.isProduction ? "production" : "development"}`);
});

const wss = new WebSocketServer({ server, path: "/ws/run" });

wss.on("connection", (ws) => {
  let started = false;

  ws.on("message", (raw) => {
    if (started) return;
    try {
      const msg = JSON.parse(typeof raw === "string" ? raw : raw.toString()) as {
        type: string;
        code?: string;
        language?: string;
      };
      if (msg.type === "run" && msg.code && msg.language) {
        started = true;
        handleInteractiveRun(ws, msg.code, msg.language).catch((err) => {
          console.error("[ws/run] execution error:", err);
          ws.send(JSON.stringify({ type: "stderr", data: "Internal error.\n" }));
          ws.send(JSON.stringify({ type: "exit", code: 1 }));
        });
      }
    } catch { /* ignore bad JSON */ }
  });
});

function shutdown() {
  console.log("Shutting down — cleaning up terminal containers...");
  destroyAllSessions().finally(() => {
    wss.close();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
