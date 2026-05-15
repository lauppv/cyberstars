# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start client (Vite :5173) + server (:5000) + db setup concurrently
npm run dev:client    # Vite dev server only
npm run dev:server    # Express server with tsx watch
npm run build         # Production build to /dist
npm run lint          # ESLint
npm run db:prepare    # Prisma generate + migrate + seed
npm run db:migrate    # Run pending migrations (prompts for name)
npm run db:deploy     # Apply migrations without prompts (CI/prod)
npm run db:seed       # Seed curriculum and lessons into PostgreSQL
npm run db:studio     # Open Prisma Studio GUI
```

No test suite exists yet.

## Architecture

CyberStars is a split-screen coding education platform (React frontend + Express backend + PostgreSQL).

### Client (`client/`)
- React 19 + Vite 7 + Tailwind CSS 4, uses HashRouter
- Routes: `/`, `/getstarted`, `/courses`, `/algorithms`, `/algorithms/:lang`, `/lesson/:category/:lesson`, `/profile`
- Three React Context providers: `AuthContext`, `CurriculumContext`, `ProgressContext`
- Services in `client/services/` wrap all API calls through a shared `apiClient` fetch wrapper
- Code editor uses CodeMirror 4 with per-language syntax highlighting

### Server (`server/`)
- Express 5 + TypeScript, runs with tsx
- Route files: `auth.routes.ts`, `lesson.routes.ts`, `code.routes.ts`, `progress.routes.ts`, `leaderboard.routes.ts`
- Controllers handle logic; Zod schemas in `server/schemas/` validate requests
- Auth: JWT in httpOnly cookies, bcryptjs password hashing
- Code execution: Docker containers locally, Piston API in production — runtimes in `server/runtimes/` (c.ts, python.ts, java.ts)

### Database (`prisma/`)
- PostgreSQL via Prisma 6 ORM
- Models: `User`, `Curriculum`, `Lesson`, `UserLessonProgress`, `UserSavedCode`
- Seed script populates all courses and lessons from filesystem

### Shared (`shared/`)
- DTO types and constants imported by both client and server — keeps request/response shapes and business rules (XP formulas, badge thresholds) in sync

### Lesson content (`server/lessons/{python,c,java}/`)
- Markdown files with fenced code blocks (` ```python `, ` ```c `, ` ```java `) for runnable examples and ` ```text ` for output
- Every C code block must include `#include`, `int main(void)`, `return 0` (full compilable program)
- Every Java code block must include `public class Main` with `public static void main(String[] args)` wrapper
- Intentional compile errors (e.g., demonstrating `if(x=2)` bug) still have full boilerplate — the error is only on the line being demonstrated

## Key conventions

- Vite proxies `/api` and `/auth` to the Express server (configured in `vite.config.ts`)
- Gamification (XP, levels, badges, streaks) is derived entirely from `UserLessonProgress` data — no separate gamification tables
- Dark theme uses CSS custom properties with accent purple `#6C5CE7`, Space Grotesk font for UI, JetBrains Mono for code
- Lesson completion is automatic when all test cases pass — no manual "complete" button
- The user communicates in Romanian; code and docs stay in English
