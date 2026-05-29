import { app } from './app.js';
import { config } from './config/index.js';
import { destroyAllSessions } from './services/terminal-session.service.js';
import { sweepRunDir } from './services/interactive-execution.service.js';
import { attachRunWebSocket } from './services/ws-run.js';

await sweepRunDir();

const server = app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.isProduction ? 'production' : 'development'}`);
});

const wss = attachRunWebSocket(server);

function shutdown() {
  console.log('Shutting down — cleaning up terminal containers...');
  destroyAllSessions().finally(() => {
    wss.close();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
