import { app } from './app.js';
import { config } from './config/index.js';
import { destroyAllSessions } from './services/terminal-session.service.js';
import { attachRunWebSocket } from './services/ws-run.js';
import { scheduleRollUp } from './services/visits.service.js';
import { scheduleRecapBell } from './services/laniakea-recaps.service.js';
import { removeStraySandboxes } from '@cyberstars-framework/sandbox/docker';
import { sandbox, SANDBOX_LABEL } from './services/sandbox.js';

// Before the first request, so only sandboxes of an earlier run are removed
try {
  const removed = await removeStraySandboxes(SANDBOX_LABEL);
  if (removed) console.log(`Removed ${removed} sandboxes left by an earlier run`);
} catch (err) {
  console.error('[sandboxes] could not look for ones left by an earlier run:', err);
}

const server = app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.isProduction ? 'production' : 'development'}`);
});

const wss = attachRunWebSocket(server);
scheduleRollUp();
scheduleRecapBell();

function shutdown() {
  console.log('Shutting down, cleaning up containers...');
  Promise.allSettled([destroyAllSessions(), sandbox.drainAll()]).finally(() => {
    wss.close();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
