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
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
npm run db:prepare    # Prisma generate + migrate + seed
npm run db:migrate    # Run pending migrations (prompts for name)
npm run db:deploy     # Apply migrations without prompts (CI/prod)
npm run db:seed       # Seed curriculum and lessons into PostgreSQL
npm run db:studio     # Open Prisma Studio GUI
npx vitest run path   # Run a single test file (substring match)
```

CI runs on every push/PR via GitHub Actions (`.github/workflows/ci.yml`): typecheck → test → build. Tests are co-located next to source files (`*.test.ts`).

## Architecture

CyberStars is a split-screen coding education platform (React frontend + Express backend + PostgreSQL).

### Client (`client/`)
- React 19 + Vite 7 + Tailwind CSS 4, uses HashRouter
- Routes: `/`, `/getstarted`, `/courses`, `/algorithms`, `/algorithms/:lang`, `/lesson/:category/:lesson`, `/profile`, `/forum`, `/almanac`, `/welcome`
- Three React Context providers: `AuthContext`, `CurriculumContext`, `ProgressContext`
- Services in `client/services/` wrap all API calls through a shared `apiClient` fetch wrapper
- Code editor uses CodeMirror 4 with per-language syntax highlighting
- Global `CosmosBackground` (canvas starfield + nebulae) renders on all routes except `/getstarted` and `/welcome` — managed in `App.tsx` via `GlobalBackground` component. Uses `isolation: isolate` on `#root` with `z-index: -1` on cosmos so content stays above without explicit z-index hacks. AuthPage and WelcomePage have their own dedicated animated backgrounds.
- Text sections over the starfield use `.text-backdrop` class (semi-transparent bg + backdrop-blur) for readability

### Server (`server/`)
- Express 5 + TypeScript, runs with tsx
- Route files: `auth.routes.ts`, `lesson.routes.ts`, `code.routes.ts`, `progress.routes.ts`, `leaderboard.routes.ts`, `forum.routes.ts`, `terminal.routes.ts`, `support.routes.ts`, `profile.routes.ts`
- Controllers handle logic; Zod schemas in `server/schemas/` validate requests
- Auth: JWT in httpOnly cookies, bcryptjs password hashing
- Code execution: Docker containers locally, Piston API in production — runtimes in `server/runtimes/` (c.ts, python.ts, java.ts)
- Terminal (Linux course): sandboxed Docker containers (`cyberstars-linux-sandbox`), stateful sessions with in-memory Map, idle GC at 15min. Container flags: `--network=none --read-only --memory=128m --pids-limit=64 --cap-drop=ALL`. Routes at `/api/terminal` (session, exec, submit, destroy)

### Database (`prisma/`)
- PostgreSQL via Prisma 6 ORM
- Core models: `User`, `Curriculum` (with `CurriculumKind` enum: editor/terminal), `Lesson`, `UserLessonProgress`, `UserSavedCode`
- Forum models: `ForumCategory`, `ForumThread`, `ForumPost`, `ForumReaction`
- Seed script populates all courses and lessons from filesystem

### Shared (`shared/`)
- DTO types and constants imported by both client and server — keeps request/response shapes and business rules (XP formulas, course keys) in sync. Badges are derived client-side only (`useGamification`)

### Lesson content (`server/lessons/{python,c,java,linux}/`)
- Markdown files with fenced code blocks (` ```python `, ` ```c `, ` ```java `, ` ```bash `) for runnable examples and ` ```text ` for output
- Every C code block must include `#include`, `int main(void)`, `return 0` (full compilable program)
- Every Java code block must include `public class Main` with `public static void main(String[] args)` wrapper
- Intentional compile errors (e.g., demonstrating `if(x=2)` bug) still have full boilerplate — the error is only on the line being demonstrated
- Linux lessons: each slug has 3 files — `<slug>.md` (no H1, space-station theme), `<slug>-setup.json` (sandbox filesystem), `<slug>-tests.json` (validation checks). 55 lessons across 9 chapters. Shared types in `shared/terminal.ts`

## Key conventions

- Vite proxies `/api` and `/auth` to the Express server (configured in `vite.config.ts`)
- Course metadata is centralised in `client/constants/courses.ts` via `courseMeta(key)` and `courseTitle(key)` — single source of truth for icons, colors, labels
- Course key constants live in `shared/constants.ts`: `MAIN_COURSE_KEYS`, `ALGO_COURSE_KEYS`, `TERMINAL_COURSE_KEYS`, `ALL_COURSE_KEYS`
- Gamification (XP, levels, badges) is derived from `UserLessonProgress` data — no separate gamification tables. Streaks are stored client-side in localStorage keyed by user ID (`cyberstars_activity_days_{userId}`)
- Profile features (avatar upload, bio, status with 24h expiry) via `/api/profile` routes with multer + magic-byte validation. Uploads served from `/uploads` static dir
- Dark theme uses CSS custom properties with accent purple `#6C5CE7`, Space Grotesk font for UI, JetBrains Mono for code
- Lesson completion is automatic when all test cases pass — no manual "complete" button
- The user communicates in Romanian; code and docs stay in English
- New features start as static HTML mockups in `design/` — these are the source of truth for layout, colors, and data structure when implementing React pages
- Page wrapper divs use `bg-transparent` (not `bg-[var(--bg)]`) so the global cosmos starfield shows through. Cards and panels keep their semi-transparent backgrounds (`rgba(22,22,29,0.72)` with `backdrop-filter: blur`).
- Topbar is semi-transparent (`rgba(22,22,29,0.78)` + `backdrop-blur`) — not opaque
