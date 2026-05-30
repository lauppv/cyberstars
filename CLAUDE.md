# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Related docs

- `ARCHITECTURE.md` — full project tree and layer-by-layer breakdown
- `AGENTS.md` — rules for AI contributors (surgical changes, full check suite before submitting)
- `CONTRIBUTING.md` — setup prerequisites and contribution workflow
- `README.md` — project overview

## Commands

```bash
npm run dev               # Start client (Vite :5173) + server (:5000) + db setup concurrently
npm run dev:client        # Vite dev server only
npm run dev:server        # Express server with tsx watch
npm run build             # Production build to /dist
npm test                  # Run Vitest unit suite once (jsdom)
npm run test:watch        # Vitest in watch mode
npm run test:coverage     # Vitest + v8 coverage (./coverage/); fails if below thresholds
npm run test:integration  # Real-Postgres integration tests (test/integration/, requires .env.test)
npm run test:e2e          # Playwright (both projects: browser + docker)
npm run test:e2e:browser  # Playwright browser-only (auth/forum/support/courses/profile)
npm run test:e2e:docker   # Playwright docker runners (Python/C/Java/terminal/ws-stdin)
npm run test:e2e:ui       # Playwright UI mode
npm run typecheck         # tsc --noEmit
npm run lint              # ESLint
npm run format            # Prettier write
npm run format:check      # Prettier check (CI-equivalent)
npm run dead-code         # knip — find unused files, exports, and dependencies
npm run db:prepare        # Prisma generate + migrate + seed
npm run db:migrate        # Run pending migrations (prompts for name)
npm run db:deploy         # Apply migrations without prompts (CI/prod)
npm run db:seed           # Seed curriculum and lessons into PostgreSQL
npm run db:studio         # Open Prisma Studio GUI
npx vitest run path       # Run a single test file (substring match)
```

CI runs on every push/PR via GitHub Actions (`.github/workflows/ci.yml`): a `setup` job warms `node_modules`, then **10 parallel jobs**: `format-check`, `lint`, `typecheck`, `test` (with coverage + PR comment), `audit` (`npm audit --audit-level=high`), `dead-code` (knip), `test-integration` (spins up a Postgres 16 service), `test-e2e-browser` + `test-e2e-docker` (Playwright with required Docker images pre-pulled), and `build`. Tests are co-located next to source files (`*.test.ts`/`*.test.tsx`); integration and E2E live in separate top-level dirs and are excluded from the unit run via `vite.config.ts`. Node version is pinned in `.node-version` (currently 24) — CI reads it via `node-version-file` (the composite action `.github/actions/setup-node-and-deps` points at `.node-version`). Keep `.node-version`, `.nvmrc`, `package.json` engines, and your local Node version in sync to avoid lock file mismatches between local and CI. Prettier check is enforced in CI; before committing larger changes prefer `npm run format` over `:check` so the working tree is normalised.

## Architecture

CyberStars is a split-screen coding education platform (React frontend + Express backend + PostgreSQL).

### Client (`client/`)

- React 19 + Vite 7 + Tailwind CSS 4, uses HashRouter
- Routes: `/`, `/getstarted`, `/courses`, `/algorithms`, `/algorithms/:lang`, `/lesson/:category/:lesson`, `/profile`, `/forum`, `/almanac`, `/laniakea`, `/rules`, `/support`, `/welcome`
- Three React Context providers: `AuthContext`, `CurriculumContext`, `ProgressContext`
- Services in `client/services/` wrap all API calls through a shared `apiClient` fetch wrapper
- Code editor uses CodeMirror 4 with per-language syntax highlighting
- Global `CosmosBackground` (canvas starfield + nebulae) renders on all routes except `/getstarted` and `/welcome` — managed in `App.tsx` via `GlobalBackground` component. Uses `isolation: isolate` on `#root` with `z-index: -1` on cosmos so content stays above without explicit z-index hacks. AuthPage and WelcomePage have their own dedicated animated backgrounds.
- Text sections over the starfield use `.text-backdrop` class (semi-transparent bg + backdrop-blur) for readability

### Server (`server/`)

- Express 5 + TypeScript, runs with tsx
- `app.ts` exports the Express app (used by supertest); `server.ts` imports it and calls `listen()`
- Three-layer architecture: Routes → Controllers → Services → Repositories
- Zod schemas in `server/schemas/` validate all request bodies via `validateBody()` middleware
- Auth: JWT in httpOnly cookies, bcryptjs password hashing
- Rate limiting: `express-rate-limit` on auth routes (10/15min) and code execution routes (10/min/IP)
- Code execution: Docker containers in all environments — runtimes in `server/runtimes/` (c.ts, python.ts, java.ts). Required Docker images: `gcc:latest`, `python:3.10-slim`, `eclipse-temurin:21-jdk-alpine`
- Interactive code execution via WebSocket at `/ws/run` — `server.ts` attaches a `WebSocketServer` to the HTTP server, client connects via `useCodeExecution` hook. 20s wall-clock timeout (resets on stdin), 1MB output cap. In production, nginx must proxy `/ws/` with `Upgrade` and `Connection "upgrade"` headers
- Password reset: `/auth/forgot-password` sends a 6-digit code via email (15min expiry), `/auth/reset-password` validates code and updates password
- Terminal (Linux course): sandboxed Docker containers (`cyberstars-linux-sandbox`), stateful sessions with in-memory Map, idle GC at 15min. Container flags: `--network=none --memory=128m --pids-limit=64 --cap-drop=ALL --security-opt=no-new-privileges --read-only` plus tmpfs mounts for `/home/student` and `/tmp`

### Database (`prisma/`)

- PostgreSQL via Prisma 6 ORM
- Core models: `User`, `Curriculum` (with `CurriculumKind` enum: editor/terminal), `Lesson`, `UserLessonProgress`, `UserSavedCode`
- Forum models: `ForumCategory`, `ForumThread`, `ForumPost` (soft-delete with `deleted`/`deletedByName`, edit tracking with `editedByName`), `ForumReaction`
- Support models: `SupportTicket`, `SupportMessage` — tickets are per-user with threaded replies; owners can close their own tickets, admins can set any status
- Seed script populates all courses and lessons from filesystem

### Shared (`shared/`)

- DTO types and constants imported by both client and server — keeps request/response shapes and course key constants in sync. Badges are derived client-side only (`useGamification`) from completion counts

### Lesson content (`server/lessons/{python,c,java,linux}/`)

- Markdown files with fenced code blocks (` ```python `, ` ```c `, ` ```java `, ` ```bash `) for runnable examples and ` ```text ` for output
- Every C code block must include `#include`, `int main(void)`, `return 0` (full compilable program)
- Every Java code block must include `public class Main` with `public static void main(String[] args)` wrapper
- Intentional compile errors (e.g., demonstrating `if(x=2)` bug) still have full boilerplate — the error is only on the line being demonstrated
- Linux lessons: each slug has 2 files — `<slug>.md` (no H1, space-station theme) and `<slug>-setup.json` (sandbox filesystem). 55 lessons across 9 chapters. Shared types in `shared/terminal.ts`

### Algorithm challenges (`server/algorithms/{python,java,c}/`)

- Separate from main lessons — mapped via `server/services/paths.ts`: course keys `algo-python`, `algo-java`, `algo-c` resolve to `server/algorithms/{python,java,c}/`
- Each challenge has 2 files: `<slug>.md` (problem statement with Input/Output/Examples/Hints) and `<slug>-code.md` (starter code)
- 20 challenges per language (Easy/Medium/Hard), registered in `prisma/seed.ts`
- Starter code reads input and has `# TODO` comments — students fill in the logic
- Lessons and challenges have no automated grading: students Run their code (Docker-backed `code-execution.service`) and decide when to click "Mark Complete" themselves

### Testing (`test/`)

- Vitest with jsdom environment, `@testing-library/react` + `@testing-library/jest-dom`
- Setup file in `test/setup.ts` handles jest-dom matchers and cleanup between tests
- Coverage via `@vitest/coverage-v8` with json-summary + lcov reporters
- Client component tests use `render`/`screen`/`fireEvent` from testing-library
- Server unit tests on services use `vi.mock` to isolate from env/DB dependencies (see `lesson.service.test.ts`)
- Endpoint smoke tests (`server/app.test.ts`) use supertest to verify all routes respond correctly (200 for public, 401 for auth-protected, 404 for unknown). Mock PrismaClient and repositories to avoid needing a real DB
- Dead code detection via knip (`npm run dead-code`) — config in `knip.config.ts`. Runs in CI; must pass before merge
- Coverage thresholds enforced in `vite.config.ts`: **90% on all metrics** (lines/statements/functions/branches) — `npm run test:coverage` fails if below
- Code formatting via Prettier — config in `.prettierrc`, check with `npm run format:check`, fix with `npm run format`
- **Integration tests** (`test/integration/`) run against a real PostgreSQL DB (config in `vitest.integration.config.ts`). `global-setup.ts` runs `prisma migrate deploy` + seed once; per-file `setup.ts` truncates app tables before each test and inserts a Sentinel ADMIN so `createAuthenticatedAgent()` returns regular USERs (first-registered-user auto-promotes to ADMIN). Tests are serial (`fileParallelism: false`) to avoid DB contention. Requires `.env.test`
- **E2E tests** (`e2e/`) use Playwright with two projects: `browser` (auth/forum/support/courses/profile via `npm run dev` webserver) and `docker` (code execution paths — needs all runner Docker images plus `cyberstars-linux-sandbox` built locally). `e2e/global-setup.ts` migrates+seeds; `e2e/fixtures/test.ts` provides an `authedPage` fixture that resets the DB and signs up a fresh user via the API before each test. The webserver autostarts the dev stack when no server is running on :5173
- CodeMirror auto-pairs `{`, `(`, `[`, `"`. In E2E tests, multi-line code typed with `keyboard.type` may produce duplicate `}` — keep test code on a single line so the typed `}` skips over the auto-paired one

### Production (`cyber-stars.org`)

- DigitalOcean VPS, app at `/opt/cyberstars`, managed by pm2 (`pm2 restart cyberstars`)
- nginx reverse proxy on port 443 → localhost:8080. The `/ws/` location block requires `proxy_set_header Upgrade` and `Connection "upgrade"` for WebSocket
- Deploy: `cd /opt/cyberstars && git pull && npm install && npm run build && pm2 restart cyberstars`
- Docker images must be pre-pulled on the server: `docker pull gcc:latest python:3.10-slim eclipse-temurin:21-jdk-alpine`

## Key conventions

- Vite proxies `/api`, `/auth`, and `/ws` to the Express server (configured in `vite.config.ts`)
- Course metadata is centralised in `client/constants/courses.ts` via `courseMeta(key)` and `courseTitle(key)` — single source of truth for icons, colors, labels
- Course key constants live in `shared/constants.ts`: `MAIN_COURSE_KEYS`, `ALGO_COURSE_KEYS`, `TERMINAL_COURSE_KEYS`, `ALL_COURSE_KEYS`
- Gamification is badge-only (no XP), derived client-side from `UserLessonProgress` counts — no separate gamification tables. Badges include "First Steps" (1 lesson) and Bronze/Silver/Gold tiers (10/20/30 lessons per course). New badge earnings trigger a 5s toast notification
- Profile features (avatar upload, bio, status with 24h expiry) via `/api/profile` routes with multer + magic-byte validation. Uploads served from `/uploads` static dir
- Dark theme uses CSS custom properties with accent purple `#6C5CE7`, Space Grotesk font for UI, JetBrains Mono for code
- Lesson completion is user-driven: students click "Mark Complete" (calls `POST /api/progress/:courseKey/:lessonSlug/complete`). There is no automated grading
- The user communicates in Romanian; code and docs stay in English
- Page wrapper divs use `bg-transparent` (not `bg-[var(--bg)]`) so the global cosmos starfield shows through
- All cards, panels, and containers use very low opacity backgrounds (`rgba(22,22,29,0.1)` with `backdrop-blur-[12px]`) so the cosmos is visible through them. Never use opaque backgrounds (`bg-[var(--bg2)]`, `bg-[var(--surface)]`) for content panels
- Panel/card borders use accent purple at 30% (`border-[var(--accent)]/30`), not `border-[var(--border)]`
- Internal separators (`border-b`, `border-t`) use `border-[var(--accent)]/20`
- CodeMirror editor has transparent backgrounds via global CSS overrides (`!important`) in `index.css` — `.cm-editor`, `.cm-line`, `.cm-content`, `.cm-gutters` are all transparent
- Topbar is semi-transparent (`rgba(22,22,29,0.78)` + `backdrop-blur`) — not opaque
- ESLint uses `typescript-eslint` parser with separate configs for `.ts/.tsx` (browser globals) and `.js` (node globals). Unused args prefixed with `_` are allowed via `argsIgnorePattern`
- License: BSD 3-Clause for code (`LICENSE`), CC BY-SA 4.0 for educational content in `server/lessons/` (`LICENSE-content.md`)
