# AGENTS.md

Instructions for AI contributors (Claude, Copilot, Cursor, etc.) working on this codebase.

## Rules

1. **Surgical changes only** — touch only what the task requires. Don't refactor, rename, or "improve" adjacent code.
2. **Match existing style** — follow the patterns already in the codebase (naming, formatting, structure).
3. **Write tests for all new code** — every new feature, fix, or behavior change needs test coverage.
4. **Run the full check suite before submitting:**
   ```bash
   npm run format
   npm run lint
   npm run typecheck
   npm test
   npm run dead-code
   ```
5. **No speculative features** — don't add abstractions, config options, or error handling beyond what's asked.
6. **Keep commits atomic** — one logical change per commit, with a clear message.

## Architecture at a glance

- `client/` — React 19 + Vite + Tailwind CSS
- `server/` — Express 5 + Prisma (PostgreSQL)
- `shared/` — DTO types and constants used by both sides
- `prisma/` — schema, migrations, seed
- `test/` — test setup (tests are co-located next to source files)

## Key conventions

- Functional components only (no class components)
- Feature-based file organization
- Zod for request validation on the server
- Three-layer server architecture: Routes → Controllers → Services → Repositories
- Coverage thresholds enforced in CI — don't let them drop

---

## Warm Container Pool for Kotlin (planned)

A session-based warm container pool to avoid JVM startup latency (~3.5s) for Kotlin code snippets. One container per (user, lesson), started when the user enters a lesson page and torn down when they leave.

### Architecture

```
Client (LessonPage)                 Server                      Docker
      │                               │                           │
      │──── enter lesson ────────────▶│                           │
      │                               │── docker run (async) ────▶│
      │◀──── { sessionId } ──────────│                     ┌──────┴──────┐
      │                               │                     │ Kotlin Eval │
      │                               │◀── ready (poll) ────│ Server (JVM)│
      │──── WS /ws/run?sessionId=xyz ─▶│                     │             │
      │──── { type: "run", code } ───▶│── docker exec + ────│  /tmp/      │
      │◀──── stdout/stderr/exit ──────│── socat relay ─────▶│  eval.sock  │
      │                               │                     └──────────────┘
      │──── leave lesson ────────────▶│                           │
      │                               │── docker rm -f ──────────▶│
```

### Files to Create

| File | Purpose |
|------|---------|
| `server/runtimes/kotlin-eval/EvalServer.kt` | Kotlin eval server: Unix socket loop, pluggable evaluator (JSR 223 / experimental), base64 protocol |
| `server/runtimes/kotlin-eval/Dockerfile` | Multi-stage build: compile EvalServer in danysk/kotlin, ship in eclipse-temurin with socat |
| `server/runtimes/kotlin-eval/entrypoint.sh` | Container entrypoint that starts the eval server |
| `server/services/session-manager.service.ts` | createSession / executeCode / destroySession / reapStale |
| `server/routes/sessions.routes.ts` | POST/DELETE /api/sessions |
| `client/hooks/useWarmSession.ts` | Mount → POST session, unmount → DELETE session |

### Files to Modify

| File | Change |
|------|--------|
| `server/runtimes/types.ts` | Add optional `warmImage?: string` to `LanguageRuntime` |
| `server/runtimes/kotlin.ts` | Add `warmImage`, drop compileCmd/runCmd |
| `server/services/interactive-execution.service.ts` | Add session-based execution path |
| `server/services/ws-run.ts` | Parse sessionId from WS query, route to session manager |
| `client/hooks/useCodeExecution.ts` | Accept optional sessionId, pass to WS URL |
| `client/pages/LessonPage.tsx` | Use `useWarmSession` for kotlin language |
| `server/server.ts` | Init SessionManager, register routes, shutdown cleanup |
| `server/config/env.ts` | Add session pool config vars |
| `docker-compose.yml` (setup) | Build cyberstars-kotlin-eval image |
| `prisma/seed.ts` | Update kotlin hello-world code template |
| `server/lessons/kotlin/hello-world-code.md` | Remove `fun main()` wrapper |

### Eval Server Design

```kotlin
interface ScriptEvaluator {
    fun eval(code: String): EvalResult
}

class Jsr223Evaluator : ScriptEvaluator { /* default, lightweight */ }
class ExperimentalEvaluator : ScriptEvaluator { /* full Kotlin semantics */ }

fun main() {
    val evaluator = createEvaluator(System.getenv("EVAL_API") ?: "jsr223")
    // 1. Open Unix socket at /tmp/eval.sock
    // 2. Accept one connection at a time
    // 3. Read base64-encoded code
    // 4. Capture stdout/stderr via PrintStream redirect
    // 5. eval() and return output delimited by ___END___
    // 6. Keep JVM alive between evals (hot classes)
}
```

### Communication Protocol

- Server calls: `docker exec -i <container> socat - UNIX-CONNECT:/tmp/eval.sock`
- Request: base64-encoded code + newline
- Response: stdout + stderr captured, followed by `___END___\n` marker
- Timeout: 20s per eval

### Security

Same hardening as current sandbox containers, plus:
- `--network=none` (Unix socket only)
- `--read-only` with `/tmp` as tmpfs
- No host bind mounts needed (code piped via socat)

### Starter Templates

Kotlin lessons will use top-level code (no `fun main()`):
```kotlin
println("Hello, World!")
```

### Config (env vars)

| Var | Default | Purpose |
|-----|---------|---------|
| `SESSION_POOL_TIMEOUT` | `900000` (15 min) | Stale session reaper |
| `SESSION_MAX_PER_USER` | `5` | Max concurrent sessions |
| `SESSION_EVAL_TIMEOUT` | `20000` (20s) | Per-eval timeout |
| `WARM_IMAGE_TAG` | `latest` | Tag for warm images |
| `EVAL_API` | `jsr223` | Kotlin eval API variant |

### Decisions

- **Session scope**: one container per (user, lesson) — started on lesson enter, torn down on leave.

### Open Questions (team discussion needed)

- Max evals before recycling a container (memory leak safety net)?
- Should this be extended to Java as well?
