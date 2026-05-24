# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start client (Vite :5173) + server (:5000) + db setup concurrently
npm run dev:client    # Vite dev server only
npm run dev:server    # Express server with tsx watch
npm run build         # Production build to /dist
npm test              # Run Vitest test suite once
npm run test:watch    # Vitest in watch mode
npm run test:coverage # Run tests with coverage report (v8, outputs to ./coverage/)
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
npm run dead-code     # knip — find unused files, exports, and dependencies
npm run db:prepare    # Prisma generate + migrate + seed
npm run db:migrate    # Run pending migrations (prompts for name)
npm run db:deploy     # Apply migrations without prompts (CI/prod)
npm run db:seed       # Seed curriculum and lessons into PostgreSQL
npm run db:studio     # Open Prisma Studio GUI
npx vitest run path   # Run a single test file (substring match)
```

CI runs on every push/PR via GitHub Actions (`.github/workflows/ci.yml`): parallel jobs for lint, typecheck, test (with coverage + PR comment), dead-code (knip), and build. Tests are co-located next to source files (`*.test.ts`/`*.test.tsx`). Node version is pinned in `.node-version` (currently 24) — CI reads it via `node-version-file`. Keep `.node-version`, `package.json` engines, and your local Node version in sync to avoid lock file mismatches between local and CI.

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
- Interactive code execution via WebSocket at `/ws/run` — `server.ts` attaches a `WebSocketServer` to the HTTP server, client connects via `useCodeExecution` hook. In production, nginx must proxy `/ws/` with `Upgrade` and `Connection "upgrade"` headers
- Terminal (Linux course): sandboxed Docker containers (`cyberstars-linux-sandbox`), stateful sessions with in-memory Map, idle GC at 15min. Container flags: `--network=none --read-only --memory=128m --pids-limit=64 --cap-drop=ALL`

### Database (`prisma/`)
- PostgreSQL via Prisma 6 ORM
- Core models: `User`, `Curriculum` (with `CurriculumKind` enum: editor/terminal), `Lesson`, `UserLessonProgress`, `UserSavedCode`
- Forum models: `ForumCategory`, `ForumThread`, `ForumPost` (soft-delete with `deleted`/`deletedByName`, edit tracking with `editedByName`), `ForumReaction`
- Support models: `SupportTicket`, `SupportMessage` — tickets are per-user with threaded replies; owners can close their own tickets, admins can set any status
- Seed script populates all courses and lessons from filesystem

### Shared (`shared/`)
- DTO types and constants imported by both client and server — keeps request/response shapes and business rules (XP formulas, course keys) in sync. Badges are derived client-side only (`useGamification`)

### Lesson content (`server/lessons/{python,c,java,linux}/`)
- Markdown files with fenced code blocks (` ```python `, ` ```c `, ` ```java `, ` ```bash `) for runnable examples and ` ```text ` for output
- Every C code block must include `#include`, `int main(void)`, `return 0` (full compilable program)
- Every Java code block must include `public class Main` with `public static void main(String[] args)` wrapper
- Intentional compile errors (e.g., demonstrating `if(x=2)` bug) still have full boilerplate — the error is only on the line being demonstrated
- Linux lessons: each slug has 3 files — `<slug>.md` (no H1, space-station theme), `<slug>-setup.json` (sandbox filesystem), `<slug>-tests.json` (validation checks). 55 lessons across 9 chapters. Shared types in `shared/terminal.ts`

### Algorithm challenges (`server/algorithms/{python,java,c}/`)
- Separate from main lessons — mapped via `server/services/paths.ts`: course keys `algo-python`, `algo-java`, `algo-c` resolve to `server/algorithms/{python,java,c}/`
- Each challenge has 3 files: `<slug>.md` (problem statement with Input/Output/Examples/Hints), `<slug>-code.md` (starter code), `<slug>-tests.json` (test cases)
- 20 challenges per language (Easy/Medium/Hard), registered in `prisma/seed.ts`
- Starter code reads input and has `# TODO` comments — students fill in the logic
- Test modes in `-tests.json`: `exact` (trimmed output === expected), `regex` (output matches pattern), `code_regex` (student code matches pattern), `contains`, `line` (specific line matches), `any` (any non-empty output)
- **Critical rule for `code_regex` tests**: the regex must NOT match the unmodified starter code, otherwise the test passes by default without the student implementing anything. Always verify with: `new RegExp(expected).test(starterCode)` — must return `false`
- Tests can use `overrides` (replace variable assignments) and `append` (add code after student's code) fields
- Test runner in `server/services/test-runner.service.ts` — executes code via Docker, trims output, compares against expected

### Testing (`test/`)
- Vitest with jsdom environment, `@testing-library/react` + `@testing-library/jest-dom`
- Setup file in `test/setup.ts` handles jest-dom matchers and cleanup between tests
- Coverage via `@vitest/coverage-v8` with json-summary + lcov reporters
- Client component tests use `render`/`screen`/`fireEvent` from testing-library
- Server unit tests on services use `vi.mock` to isolate from env/DB dependencies (see `lesson.service.test.ts`)
- Endpoint smoke tests (`server/app.test.ts`) use supertest to verify all routes respond correctly (200 for public, 401 for auth-protected, 404 for unknown). Mock PrismaClient and repositories to avoid needing a real DB
- Dead code detection via knip (`npm run dead-code`) — config in `knip.config.ts`, ignores `design/` mockups. Runs in CI; must pass before merge
- Coverage thresholds enforced in `vite.config.ts`: 70% statements/lines, 50% branches, 60% functions — `npm run test:coverage` fails if below

### Production (`cyber-stars.org`)
- DigitalOcean VPS, app at `/opt/cyberstars`, managed by pm2 (`pm2 restart cyberstars`)
- nginx reverse proxy on port 443 → localhost:8080. The `/ws/` location block requires `proxy_set_header Upgrade` and `Connection "upgrade"` for WebSocket
- Deploy: `cd /opt/cyberstars && git pull && npm install && npm run build && pm2 restart cyberstars`
- Docker images must be pre-pulled on the server: `docker pull gcc:latest python:3.10-slim eclipse-temurin:21-jdk-alpine`

## Key conventions

- Vite proxies `/api`, `/auth`, and `/ws` to the Express server (configured in `vite.config.ts`)
- Course metadata is centralised in `client/constants/courses.ts` via `courseMeta(key)` and `courseTitle(key)` — single source of truth for icons, colors, labels
- Course key constants live in `shared/constants.ts`: `MAIN_COURSE_KEYS`, `ALGO_COURSE_KEYS`, `TERMINAL_COURSE_KEYS`, `ALL_COURSE_KEYS`
- Gamification (XP, levels, badges) is derived from `UserLessonProgress` data — no separate gamification tables. Streaks are stored client-side in localStorage keyed by user ID (`cyberstars_activity_days_{userId}`)
- Profile features (avatar upload, bio, status with 24h expiry) via `/api/profile` routes with multer + magic-byte validation. Uploads served from `/uploads` static dir
- Dark theme uses CSS custom properties with accent purple `#6C5CE7`, Space Grotesk font for UI, JetBrains Mono for code
- Lesson completion is automatic when all test cases pass — no manual "complete" button
- The user communicates in Romanian; code and docs stay in English
- New features start as static HTML mockups in `design/` — these are the source of truth for layout, colors, and data structure when implementing React pages
- Page wrapper divs use `bg-transparent` (not `bg-[var(--bg)]`) so the global cosmos starfield shows through
- All cards, panels, and containers use very low opacity backgrounds (`rgba(22,22,29,0.1)` with `backdrop-blur-[12px]`) so the cosmos is visible through them. Never use opaque backgrounds (`bg-[var(--bg2)]`, `bg-[var(--surface)]`) for content panels
- Panel/card borders use accent purple at 30% (`border-[var(--accent)]/30`), not `border-[var(--border)]`
- Internal separators (`border-b`, `border-t`) use `border-[var(--accent)]/20`
- CodeMirror editor has transparent backgrounds via global CSS overrides (`!important`) in `index.css` — `.cm-editor`, `.cm-line`, `.cm-content`, `.cm-gutters` are all transparent
- Topbar is semi-transparent (`rgba(22,22,29,0.78)` + `backdrop-blur`) — not opaque
- ESLint uses `typescript-eslint` parser with separate configs for `.ts/.tsx` (browser globals) and `.js` (node globals). Unused args prefixed with `_` are allowed via `argsIgnorePattern`
- License: BSD 3-Clause for code (`LICENSE`), CC BY-SA 4.0 for educational content in `server/lessons/` (`LICENSE-content.md`)
