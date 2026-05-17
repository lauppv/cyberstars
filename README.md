# CyberStars

A free interactive coding education platform, inspired by freeCodeCamp, where users learn Python, C, and Java through structured lessons with embedded runnable code examples. Each lesson includes educational content on the left and a live code editor on the right, so learners can read, write, and execute code in the same view. Logged-in users get progress tracking and code persistence across sessions.

> **Note:** This is a portfolio project. This README intentionally includes detailed API endpoints, database schema, and architecture decisions that would normally live in internal documentation — the goal is to give reviewers a complete picture of the system without having to dig through the code.

## Table of contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Code Execution](#code-execution)
- [Lesson Content](#lesson-content)
- [Architecture Decisions](#architecture-decisions)

## Features

- **Split-screen lesson view** — educational Markdown content on the left, live code editor (CodeMirror) on the right
- **Inline runnable code blocks** — code examples inside lesson text are interactive; click "Run Code" to execute them directly in the lesson
- **Test case validation** — each lesson has test cases that verify the user's code (like LeetCode). A lesson is marked complete only when all tests pass — there is no manual "complete" button
- **Multi-language support** — Python (49 lessons), Java (50 lessons), C (45 lessons) with language-specific syntax highlighting
- **Algorithm challenges** — 45 algorithm challenges across 3 languages (Python, Java, C), each with difficulty levels (Easy/Medium/Hard) and colored difficulty filters
- **Remote code execution** — user code runs server-side via Docker containers (sandboxed, all environments), not in the browser
- **Progress tracking** — lessons are automatically marked complete when all test cases pass, with per-course progress bars
- **Gamification UI** — XP bar (non-linear XP per lesson based on sort order), level badge, streak widget, achievement toasts on completion, and 8 unlockable badges (First Code / Speed Run / Bug Squasher / On Fire / Diamond / Half Century / Course Master / Polyglot). All values are derived from real `UserLessonProgress` data — no separate gamification tables
- **Persistent course sidebar** — when viewing a lesson, a sidebar shows every lesson in the current course with a numbered marker (active = accent, completed = green ✓), a course progress bar, and the badges grid
- **Code persistence** — user code is saved per lesson and restored on revisit, so learners never lose their work
- **Curriculum from database** — courses and lessons are served from PostgreSQL with ordering, not hardcoded in the frontend
- **JWT authentication** — signup/login with httpOnly cookie-based sessions
- **Dark theme with design tokens** — palette built around an `--accent` purple (`#6C5CE7`), Space Grotesk for UI, JetBrains Mono for code; everything driven by CSS custom properties so theming/recoloring is a one-file change

## Screenshots

![Auth](screenshots/auth.png)
![Dashboard](screenshots/dashboard.png)
![Courses](screenshots/courses.png)
![Courses list](screenshots/courses_list.png)
![Algos](screenshots/algos.png)
![Algos list](screenshots/algos_list.png)
![Lesson success](screenshots/success.png)
![Lesson fail](screenshots/fail.png)
![Profile](screenshots/profile.png)

## Tech Stack

**Frontend:** React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + React Router 7 + CodeMirror 4 + React Markdown

**Backend:** Node.js + Express 5 + TypeScript + Prisma 6 (PostgreSQL) + Zod 4 + tsx

**Code Execution:** Docker containers (sandboxed)

**Auth:** JWT (jsonwebtoken) + bcryptjs + httpOnly cookies

**Shared:** A top-level `shared/` folder holds DTO/contract types and constants imported by both backend and frontend, so request/response shapes and business rules (like XP formulas) can never drift between the two sides.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (v14+)
- [Docker](https://www.docker.com/) (required — for code execution sandboxing)

### Installing prerequisites

**Ubuntu/Debian:**

```bash
# Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql

# Docker (for local code execution)
sudo apt install -y docker.io
sudo systemctl start docker
sudo usermod -aG docker $USER
# IMPORTANT: log out and log back in for the group change to take effect
```

**macOS (Homebrew):**

```bash
brew install node postgresql@14
brew services start postgresql@14
brew install --cask docker
```

### Docker images

After installing Docker, pull the images used for code execution:

```bash
docker pull python:3.10-slim
docker pull gcc:14
docker pull eclipse-temurin:21-jdk-alpine
```

Without these images, code execution will fail silently (returning "Error reading output file").

### Setting up the database

```bash
sudo -u postgres psql
```

```sql
CREATE USER cyberstars WITH PASSWORD 'your_password';
CREATE DATABASE cyberstars OWNER cyberstars;
\q
```

## Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/lauppv/cyberstars
cd cyberstars
npm install
```

`npm install` runs `prisma generate` automatically (via `postinstall`), producing the typed Prisma Client used by the backend.

2. Create and configure the `.env` file in the project root:

```env
DB_USER=cyberstars
DB_HOST=localhost
DB_NAME=cyberstars
DB_PASSWORD=your_password
DB_PORT=5432

DATABASE_URL=postgresql://cyberstars:your_password@localhost:5432/cyberstars

EXPRESS_PORT=5000
JWT_SECRET=your_secret_key

NODE_ENV=development
VITE_DEV_API_URL=http://localhost:5000
VITE_PROD_API_URL=
```

`DATABASE_URL` is what the Prisma CLI reads (`prisma migrate`, `prisma studio`, etc.). The runtime backend can construct it from the individual `DB_*` vars on its own, but the CLI requires the assembled URL.

3. Start the development servers:

```bash
npm run dev
```

This automatically prepares the database (generates Prisma Client, applies migrations, seeds the curriculum) and then starts both frontend (Vite on `http://localhost:5173`) and backend (`tsx watch` on `http://localhost:5000`) concurrently. Open `http://localhost:5173` in the browser. Hot reload is enabled for both — any file change is picked up automatically.

No manual database setup steps are needed — `npm run dev` handles everything. If the database already has the legacy SQL-migrated schema, mark the Prisma baseline as applied first:

```bash
npx prisma migrate resolve --applied 0_init
```

For production, build and start with:

```bash
npm run start
```

### Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | **Prepares DB + starts dev servers.** Runs `db:prepare` (generate + migrate + seed), then starts Vite + Express concurrently |
| `npm run db:prepare` | Generates Prisma Client, applies migrations, seeds curriculum. Idempotent — safe to run repeatedly |
| `npm run db:generate` | Regenerates the Prisma Client from `schema.prisma` |
| `npm run db:migrate` | `prisma migrate dev` — creates and applies a new migration in development |
| `npm run db:deploy` | `prisma migrate deploy` — applies pending migrations (used in production / fresh installs) |
| `npm run db:seed` | Seeds the curriculum + lessons via `prisma/seed.ts` |
| `npm run db:studio` | Opens Prisma Studio (DB browser at `http://localhost:5555`) |

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DB_USER` | PostgreSQL user | Yes | — |
| `DB_HOST` | PostgreSQL host | Yes | — |
| `DB_NAME` | Database name | Yes | — |
| `DB_PASSWORD` | Database password | Yes | — |
| `DB_PORT` | PostgreSQL port | No | `5432` |
| `DATABASE_URL` | Connection string used by the Prisma CLI | Yes (for `prisma` commands) | — |
| `EXPRESS_PORT` | Backend server port | No | `5000` |
| `JWT_SECRET` | Secret for signing JWT tokens | Yes | — |
| `NODE_ENV` | `development` or `production` | No | `development` |
| `VITE_PROD_API_URL` | Production API URL (for deployed frontend) | Production only | — |
| `CODE_RUN_DIR` | Host directory for per-run scratch dirs (dev Docker runner) | No | `os.tmpdir()/cyberstars-runs` |
| `CODE_RUN_MEMORY` | Per-container memory limit passed to `docker run --memory=` | No | `128m` |
| `CODE_RUN_PIDS` | Per-container PID limit passed to `docker run --pids-limit=` | No | `64` |

## Project Structure

```
cyberstars/
├── shared/                                 # Cross-cutting types + constants (imported by both server and client)
│   ├── constants.ts                        # xpForLesson (non-linear), level formula (computeLevel, xpForLevel, xpToNextLevel)
│   ├── auth.ts                             # AuthenticatedUser, LoginPayload, SignupPayload, TokenPayload
│   ├── lesson.ts                           # LessonContent, LessonMeta, Course
│   ├── progress.ts                         # CourseProgress, LessonProgressItem
│   └── tests.ts                            # TestCase, TestResult, SubmitResult, TestMode (6 modes)
│
├── prisma/                                 # Schema, migrations, seed
│   ├── schema.prisma                       # 5 models with camelCase fields + @map snake_case columns
│   ├── seed.ts                             # Seeds 6 courses (3 language + 3 algorithm) + 212 lessons (idempotent via upsert)
│   └── migrations/
│       ├── migration_lock.toml
│       └── 0_init/
│           └── migration.sql               # Baseline schema (users, curriculum, lessons, progress, saved code)
│
├── server/                                 # Backend (Express + TypeScript)
│   ├── server.ts                           # Express entry point, route mounting, static SPA serving
│   ├── tsconfig.json                       # Backend TypeScript config (rootDir = repo root, includes shared/)
│   ├── config/
│   │   ├── env.ts                          # dotenv + required-var validation, typed config object
│   │   ├── db.ts                           # Prisma Client singleton (URL built from env or DATABASE_URL)
│   │   └── index.ts                        # Re-exports `config` and `prisma`
│   ├── schemas/                            # Zod request schemas (input validation)
│   │   ├── auth.schema.ts                  # signupSchema, loginSchema
│   │   ├── code.schema.ts                  # runCodeSchema, submitCodeSchema (python/c/java + algo-* variants)
│   │   └── progress.schema.ts              # saveCodeSchema
│   ├── middleware/
│   │   ├── auth.ts                         # JWT verification (authenticateToken + optionalAuth)
│   │   ├── validate.ts                     # validateBody(schema) — Zod parser middleware
│   │   └── errorHandler.ts                 # AppError class + global error handler
│   ├── repositories/                       # Pure data access (Prisma Client only, no business logic)
│   │   ├── user.repository.ts              # findByEmail, findById, create
│   │   ├── curriculum.repository.ts        # getAllCourses, getLessonsByCourse, getAllLessons, getLessonCount
│   │   └── progress.repository.ts          # upsertProgress, upsertCode, getSavedCode, touchAccess
│   ├── services/                           # Business logic (no req/res, no SQL)
│   │   ├── auth.service.ts                 # signup, login, getUser (bcrypt + JWT)
│   │   ├── lesson.service.ts               # getLessonContent, getLessonCode, getCurriculum
│   │   ├── code-execution.service.ts       # execute (Docker, supports stdin)
│   │   ├── test-runner.service.ts          # Run code against JSON test cases, compare output (6 test modes)
│   │   ├── terminal-session.service.ts     # Manage sandboxed Docker terminal sessions (create, exec, destroy, idle GC)
│   │   ├── terminal-test-runner.service.ts # Validate Linux lesson state against -tests.json checks
│   │   ├── paths.ts                        # contentDir() — resolves lesson/algorithm content directories
│   │   └── progress.service.ts             # markComplete, saveCode, getSavedCode, getCourseProgress
│   ├── controllers/                        # Thin req/res layer
│   │   ├── auth.controller.ts              # signup, login, logout, me
│   │   ├── lesson.controller.ts            # getLesson, getLessonCode, getCurriculum
│   │   ├── code.controller.ts              # executeCode, submitCode
│   │   └── progress.controller.ts          # getCourseProgress, markComplete, saveCode, trackAccess
│   ├── routes/                             # Route wiring + per-route middleware (auth + validate)
│   │   ├── auth.routes.ts                  # /auth/*
│   │   ├── lesson.routes.ts                # /api/lessons/*, /api/lesson-code/*, /api/curriculum
│   │   ├── code.routes.ts                  # /api/run-code, /api/run-code/submit
│   │   ├── progress.routes.ts              # /api/progress/* (all authenticated)
│   │   ├── leaderboard.routes.ts           # /api/leaderboard
│   │   ├── forum.routes.ts                 # /api/forum/*
│   │   ├── terminal.routes.ts              # /api/terminal/* (Linux sandbox)
│   │   ├── support.routes.ts               # /api/support/tickets/*
│   │   └── profile.routes.ts               # /api/profile/*
│   ├── types/
│   │   └── express.d.ts                    # Augments Express Request with `user` property
│   ├── lessons/                            # Markdown lesson content (read from filesystem)
│   │   ├── python/                         # 49 lessons (print, variables, loops, functions, algorithms, projects)
│   │   ├── java/                           # 50 lessons (basics, OOP, collections, inheritance, projects)
│   │   └── c/                              # 16 lessons (print, variables, loops, functions, arrays)
│   ├── algorithms/                         # Algorithm challenges (separate from lessons)
│   │   ├── python/                         # 15 challenges (easy/medium/hard — strings, lists, ciphers, two sum)
│   │   ├── java/                           # 15 challenges (easy/medium/hard — OOP, classes, generics, linked list)
│   │   └── c/                              # 15 challenges (easy/medium/hard — arrays, pointers, structs, merge sort)
│   └── runtimes/                           # Language registry — one file per supported language
│       ├── types.ts                        # LanguageRuntime interface (image, innerCmd)
│       ├── registry.ts                     # getRuntime(lang) — maps python/c/java + algo-* keys to runtimes
│       ├── python.ts                       # Python runtime config
│       ├── c.ts                            # C runtime config
│       ├── java.ts                         # Java runtime config
│       └── linux-sandbox/
│           └── Dockerfile                  # Image for stateful Linux terminal sessions (cyberstars-linux-sandbox)
│
├── client/                                 # Frontend (React + TypeScript)
│   ├── main.tsx                            # React entry point
│   ├── App.tsx                             # Router setup, AuthProvider + CurriculumProvider + ProgressProvider wrapper
│   ├── index.css                           # Google Fonts, design tokens (CSS variables), lesson body markdown styles, scrollbars
│   ├── vite-env.d.ts                       # Vite type declarations
│   ├── constants/
│   │   └── courses.ts                      # COURSE_ICON, COURSE_COLOR, COURSE_LABEL, COURSE_LEVEL, LANG_LABEL (includes algo-* variants)
│   ├── types/
│   │   └── api.ts                          # ApiError + isApiError (frontend-only helper)
│   ├── services/
│   │   ├── apiClient.ts                    # Centralized fetch wrapper (credentials, error normalization)
│   │   ├── authService.ts                  # login, signup, logout, getMe
│   │   ├── lessonService.ts                # fetchLesson, fetchLessonCode, fetchCurriculum
│   │   ├── codeExecutionService.ts         # runCode, submitCode
│   │   ├── progressService.ts              # getCourseProgress, markLessonComplete, saveCode
│   │   ├── forumService.ts                 # getCategories, getThreads, getThread, createThread, createPost, reactions, etc.
│   │   ├── supportService.ts               # createTicket, getMyTickets, getTicketMessages, addMessage, updateStatus
│   │   ├── profileService.ts               # updateProfile, uploadAvatar, deleteAvatar
│   │   └── terminalService.ts              # createSession, exec, submit, destroySession
│   ├── context/
│   │   ├── AuthContext.tsx                 # Global auth state (user, login, signup, logout)
│   │   ├── CurriculumContext.tsx           # Curriculum cache — fetches once, used by all pages
│   │   └── ProgressContext.tsx             # All-course progress cache — fetches once for logged-in users
│   ├── hooks/
│   │   ├── useLesson.ts                    # Fetches lesson content + saved code or template
│   │   ├── useCodeExecution.ts             # Runs code with loading/output state
│   │   ├── useProgress.ts                  # Track/save progress per course
│   │   └── useGamification.ts              # Derives XP, level, badges from real progress (no separate DB tables)
│   ├── components/
│   │   ├── ui/                             # Button (5 variants), Input, Modal, LoadingSpinner
│   │   ├── layout/                         # Topbar (logo + nav [Dashboard/Courses/Algorithms] + breadcrumb + avatar)
│   │   ├── gamification/                   # XPBar, StreakWidget, Badge, AchievementToast
│   │   ├── code/                           # CodeEditor, CodeOutput, TestResults, CodeCell, RunButton
│   │   └── markdown/                       # MarkdownRenderer (with CodeCell for runnable blocks)
│   └── pages/
│       ├── HomePage.tsx                    # Hero landing — level/XP/badges if logged in, feature cards otherwise
│       ├── AuthPage.tsx                    # Login/signup card with logo + Topbar
│       ├── WelcomePage.tsx                 # Onboarding/welcome screen shown after first signup
│       ├── CoursesPage.tsx                 # Course catalog (Python, Java, C)
│       ├── AlgorithmsPage.tsx              # Algorithm language picker (Python, Java, C cards)
│       ├── AlgorithmListPage.tsx           # Per-language algorithm list with Easy/Medium/Hard filters
│       ├── LessonPage.tsx                  # Topbar + XPBar + content split + editor panel + Output
│       ├── ProfilePage.tsx                 # User profile with stats, badges, course progress
│       ├── ForumPage.tsx                   # Community forum (categories, threads, posts, reactions)
│       ├── AlmanacPage.tsx                 # Reference/almanac page with AI-generated articles
│       ├── RestRoomPage.tsx                # Chill/lounge page
│       ├── ChallengesPage.tsx              # Coding challenges listing
│       ├── SupportPage.tsx                 # Support ticket system UI
│       └── RulesPage.tsx                   # Community rules page
│
├── index.html                              # HTML entry point
├── package.json                            # Dependencies + scripts
├── tsconfig.json                           # Frontend TypeScript config (includes shared/)
├── vite.config.ts                          # Vite config (React, Tailwind, API proxy)
└── eslint.config.js                        # ESLint config (TS + React)
```

## API Endpoints

Authentication uses httpOnly JWT cookies. Protected endpoints require the `token` cookie set by login/signup. All write endpoints validate request bodies via Zod schemas in `server/schemas/` — invalid bodies return `400` with a list of issues.

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register user, set JWT cookie. Body validated by `signupSchema` |
| POST | `/auth/login` | No | Login, set JWT cookie. Body validated by `loginSchema` |
| POST | `/auth/logout` | No | Clear JWT cookie |
| GET | `/auth/me` | Yes | Get current user (id, name, email) |

### Curriculum & Lessons

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/curriculum` | No | List all courses with their ordered lessons (from DB) |
| GET | `/api/lessons/:lang/:lesson` | No | Get lesson Markdown content |
| GET | `/api/lesson-code/:lang/:file` | No | Get starter code template for a lesson |

### Code Execution

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/run-code` | No | Execute code (`{ code, language }`) and return output. Validated by `runCodeSchema` |
| POST | `/api/run-code/submit` | Optional | Run code against lesson test cases (`{ code, language, courseKey, lessonSlug }`). Returns per-test results. Auto-marks lesson complete if all tests pass (when authenticated). Validated by `submitCodeSchema` |

### Progress (all authenticated)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/progress/:courseKey` | Yes | Get user's progress for a course (completed count, per-lesson status) |
| POST | `/api/progress/:courseKey/:lessonSlug/complete` | Yes | Mark a lesson as completed |
| GET | `/api/progress/:courseKey/:lessonSlug/code` | Yes | Get user's saved code for a lesson |
| PUT | `/api/progress/:courseKey/:lessonSlug/code` | Yes | Save user's code for a lesson. Validated by `saveCodeSchema` |
| POST | `/api/progress/:courseKey/:lessonSlug/access` | Yes | Track last access time for a lesson |

### Leaderboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/leaderboard` | Optional | Global leaderboard ranked by total XP. If authenticated, the current user is flagged in the response |

### Forum

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/forum/categories` | No | List all forum categories |
| GET | `/api/forum/categories/:categorySlug/threads` | No | List threads in a category |
| GET | `/api/forum/threads/:threadId` | Optional | Get a thread with its posts and reactions |
| POST | `/api/forum/threads` | Yes | Create a new thread. Body validated by `createThreadSchema` |
| POST | `/api/forum/threads/:threadId/posts` | Yes | Reply to a thread. Body validated by `createPostSchema` |
| DELETE | `/api/forum/threads/:threadId` | Yes | Delete a thread (owner or admin) |
| POST | `/api/forum/posts/:postId/reactions` | Yes | Toggle a reaction on a post. Body validated by `toggleReactionSchema` |
| POST | `/api/forum/posts/:postId/solution` | Yes | Mark a post as the solution to a thread |
| PUT | `/api/forum/posts/:postId` | Yes | Edit a post. Body validated by `updatePostSchema` |
| DELETE | `/api/forum/posts/:postId` | Yes | Soft-delete a post (owner or admin) |
| PUT | `/api/forum/users/:userId/role` | Yes (admin) | Update a user's forum role. Body validated by `updateUserRoleSchema` |

### Terminal (Linux sandbox)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/terminal/session` | Yes | Create a new sandboxed terminal session (Docker container) |
| POST | `/api/terminal/exec` | Yes | Execute a command in an existing terminal session |
| POST | `/api/terminal/submit` | Optional | Run lesson validation checks against the current session filesystem |
| DELETE | `/api/terminal/session/:sessionId` | Yes | Destroy a terminal session and remove the container |

### Support

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/support/tickets` | Yes | Create a new support ticket |
| GET | `/api/support/tickets/mine` | Yes | Get the current user's support tickets |
| GET | `/api/support/tickets` | Yes (admin) | Get all support tickets |
| PUT | `/api/support/tickets/:id/status` | Yes | Update ticket status (owner can close; admin can set any status) |
| GET | `/api/support/tickets/:id/messages` | Yes | Get messages for a ticket |
| POST | `/api/support/tickets/:id/messages` | Yes | Add a reply message to a ticket |

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/api/profile` | Yes | Update profile fields (bio, status, displayName) |
| POST | `/api/profile/avatar` | Yes | Upload a new avatar image (multipart/form-data, magic-byte validated) |
| DELETE | `/api/profile/avatar` | Yes | Remove the current avatar |

## Database Schema

The schema is defined in [`prisma/schema.prisma`](prisma/schema.prisma) — it is the single source of truth. Migrations live in `prisma/migrations/` and are applied with `prisma migrate deploy`.

### Models

- **User** (`users`) — account data (name, email, hashed password, createdAt). Email is unique.
- **Curriculum** (`curriculum`) — course definitions (key, title, description, sortOrder). `key` is unique.
- **Lesson** (`lessons`) — lesson metadata (courseKey, slug, title, sortOrder, hasCodeFile). Unique on `(courseKey, slug)`.
- **UserLessonProgress** (`user_lesson_progress`) — per-user lesson completion (completed, completedAt, lastAccessedAt). Unique on `(userId, courseKey, lessonSlug)`. Indexed on `userId` and `(userId, courseKey)`.
- **UserSavedCode** (`user_saved_code`) — per-user saved code per lesson (code, updatedAt). Unique on `(userId, courseKey, lessonSlug)`. Indexed on `userId`.
- **ForumCategory** (`forum_categories`) — top-level forum categories (name, slug, description, icon, sortOrder). `slug` is unique.
- **ForumThread** (`forum_threads`) — discussion threads (categoryId, authorId, title, body, pinned, locked, solutionPostId). Indexed on `categoryId`.
- **ForumPost** (`forum_posts`) — replies in a thread (threadId, authorId, body, soft-delete via `deleted`/`deletedByName`, edit tracking via `editedByName`/`editedAt`). Indexed on `threadId`.
- **ForumReaction** (`forum_reactions`) — emoji reactions on posts (postId, userId, emoji). Unique on `(postId, userId, emoji)`.
- **SupportTicket** (`support_tickets`) — user support tickets (userId, subject, status). Indexed on `userId`.
- **SupportMessage** (`support_messages`) — threaded replies on a ticket (ticketId, authorId, body). Indexed on `ticketId`.

Field names use camelCase in TypeScript (`courseKey`, `sortOrder`, `completedAt`) and are mapped to snake_case columns (`course_key`, `sort_order`, `completed_at`) via Prisma's `@map`/`@@map`. Table names also use snake_case via `@@map`.

### Relationships

```
User (1) ──→ (N) UserLessonProgress    (ON DELETE CASCADE)
User (1) ──→ (N) UserSavedCode         (ON DELETE CASCADE)
Curriculum.key ←── Lesson.courseKey     (logical, not enforced as FK — kept simple)
```

Lesson content itself is stored as Markdown files on the filesystem (`server/lessons/:lang/:slug.md`), not in the database. The `Lesson` table stores metadata (ordering, titles) while the actual content is read from disk at request time.

## Code Execution

User code is never executed in the browser. It's sent to the backend, which delegates execution to an external runtime:

### Docker (all environments)

User code runs in local Docker containers with volume-mounted temp directories in all environments:

| Language | Docker Image | Behavior |
|----------|-------------|----------|
| Python | `python:3.10-slim` | Runs with 5s timeout |
| C | `gcc:14` | Compiles with `-Wall`, then runs binary with 5s timeout |
| Java | `eclipse-temurin:21-jdk-alpine` | `javac` then runs `Main` with 5s timeout |

**Important:** Your user must be in the `docker` group (`sudo usermod -aG docker $USER`, then log out and back in). Without this, code execution will fail with a permission error. You also need to pull the three images listed above before running code.

The execution flow: create a per-run temp dir under `os.tmpdir()/cyberstars-runs/<uuid>/` → write `<sourceFile>`, `stdin.txt`, empty `output.txt` → run the container with the dir mounted at `/work` → read `output.txt` → cleanup. All executions have a 5-second timeout to prevent infinite loops.

Containers are launched with sandboxing flags by default — `--network=none`, `--memory=128m`, `--pids-limit=64` — and Docker is invoked via `execFile` with an argument array (no shell interpolation). CPU is unbounded (the per-runtime `timeout 5` inside the inner command stops infinite loops). The limits can be tuned via the `CODE_RUN_*` env vars.

### Adding a new language

The runner is generic over the `LanguageRuntime` interface in `server/runtimes/types.ts`. Adding a language is two steps:

1. Create `server/runtimes/<lang>.ts` exporting an object with `name`, `image`, `pistonVersion`, `sourceFile`, and `innerCmd` (the shell command run inside the container; uses fixed paths under `/work/`).
2. Register it in `server/runtimes/registry.ts`.

No changes to the service, controllers, or routes are required.

## Lesson Content

Lessons are authored in Markdown and stored in `server/lessons/:language/`. Algorithm challenges live in `server/algorithms/:language/`. Each lesson/challenge consists of:

- **`lesson-slug.md`** — the educational content (explanations, examples, inline code blocks)
- **`lesson-slug-code.md`** — the starter code template for the right-side editor
- **`lesson-slug-tests.json`** — test cases that validate the user's solution

Code blocks in the Markdown content that are tagged with a supported language (`` ```python ``, `` ```c ``, `` ```java ``) are rendered as interactive CodeCell components with their own editor and "Run Code" button, so learners can experiment with examples without leaving the lesson text.

### Test Cases

Each lesson's test file defines an array of test cases. Supported test modes:

| Mode | Description |
|------|-------------|
| `exact` | Output must match expected string exactly (trimmed) |
| `contains` | Output must contain the expected string |
| `any` | Any non-empty output passes |
| `line` | A specific line of the output must match (by line index) |
| `regex` | Output must match a regular expression pattern |
| `code_regex` | The submitted source code must match a regular expression (validates code structure, not output) |

Tests can also use `overrides` to inject variable values into user code (for testing different inputs on the same logic), and `append` to add function calls after user code (for testing function definitions). The full test case shape lives in `shared/tests.ts` and is the same type used by both the test runner on the server and the result rendering on the client.

### Available lessons

| Course | Count | Topics |
|--------|-------|--------|
| Python | 49 lessons | print, variables, f-strings, comments, conditionals, loops, functions, input, operators, booleans, string methods, lists, break/continue, return values, dictionaries, tuples, sets, nested loops, list comprehension, scope, default params, try/except, built-in functions, patterns, algorithms, recursion, matrices, projects |
| Java | 50 lessons | print, variables, strings, comments, conditionals, loops, methods, input, operators, booleans, string methods, arrays, break/continue, return values, method overloading, nested loops, ArrayList, HashMap, Math class, classes & objects, constructors, instance methods, getters/setters, toString, static, final, scope & access, null, wrapper classes, inheritance, method overriding, polymorphism, abstract classes, interfaces, type casting, try/catch, String.format, sorting, enums, switch, projects |
| C | 45 lessons | print, variables (integers/floats), comments, if/else, if/else if/else, for loops, while loops, functions, input (scanf), operators, booleans, strings, arrays, looping over arrays, break/continue, nested loops, pointers, pointers and functions, pointers and arrays, string functions, structs, structs and pointers, dynamic memory, enums, typedef, preprocessor, file I/O, bitwise operators, OS processes, fork, pipes, threads, projects |
| Python Algorithms | 15 challenges | reverse string, sum of digits, count vowels, palindrome, find maximum, even/odd, count words, sum of list, longest word, reverse words, caesar cipher, remove duplicates, anagram check, words with vowels, two sum |
| Java Algorithms | 15 challenges | student GPA, rectangle calculator, bank account, counter class, temperature converter, string stats, dice roller, shopping item, sort students, inventory manager, shape hierarchy, stack, linked list, iterator pattern, generic pair |
| C Algorithms | 15 challenges | reverse array, string length, count chars, sum array, find minimum, even count, print triangle, digit count, swap pointers, dynamic array, matrix transpose, struct sort, bitwise ops, linked list, merge sort |

Adding a new lesson requires: (1) creating the `.md` file in the appropriate directory (`server/lessons/:lang/` for courses, `server/algorithms/:lang/` for algorithm challenges), (2) creating a `-code.md` starter template, (3) creating a `-tests.json` file with test cases, and (4) adding the lesson row to `prisma/seed.ts`. The next `npm run dev` will automatically seed it into the database. Algorithm challenge titles must follow the `"Easy · Name"` / `"Medium · Name"` / `"Hard · Name"` format for the difficulty filter to work.

## Architecture Decisions

- **Controller → Service → Repository**: The backend follows a strict three-layer separation. Controllers handle HTTP concerns (req/res, cookies), services contain business logic (password hashing, token creation, progress aggregation), and repositories are the only place Prisma is touched. Each layer is testable and replaceable independently.

- **Prisma over hand-written SQL**: The data layer uses Prisma Client, with `prisma/schema.prisma` as the single source of truth for both the database structure and the TypeScript types in repositories. Migrations are versioned in `prisma/migrations/` and applied with `prisma migrate deploy`. Seed data lives in `prisma/seed.ts` (TypeScript), not SQL — it's idempotent (`upsert`) so it can run safely on top of an existing DB.

- **Zod-validated request bodies**: Every write endpoint (`POST` / `PUT`) is wrapped in a `validateBody(schema)` middleware that parses the body through a Zod schema from `server/schemas/`. Invalid input never reaches a controller — the middleware returns `400` with a list of issues. Schemas double as inferred TypeScript types, so the validated body is fully typed downstream.

- **Shared types and constants between client and server**: A top-level `shared/` directory holds DTO/contract types (`auth`, `lesson`, `progress`, `tests`) and business constants (`constants.ts` — XP per lesson, leveling formula) imported by both `server/` and `client/`. The wire format and game rules are defined exactly once. If the server response shape changes, the frontend type-check fails immediately rather than silently drifting.

- **Centralized frontend constants**: Course metadata (icons, colors, labels, difficulty levels, language labels) lives in `client/constants/courses.ts` — a single source of truth. No page defines its own `COURSE_ICON` map; all import from the same file.

- **Cookie-based auth over Bearer tokens**: JWT tokens are stored in httpOnly cookies instead of localStorage. This prevents XSS from accessing tokens — the browser handles cookie attachment automatically via `credentials: "include"`, and the server never exposes the token to JavaScript.

- **Filesystem lessons, database metadata**: Lesson content lives in `.md` files (easy to author and version with git), while ordering and metadata live in PostgreSQL (easy to query and extend). This avoids putting large text blobs in the database while keeping the curriculum structure queryable. A shared `contentDir()` helper in `server/services/paths.ts` resolves the correct directory for both regular lessons (`server/lessons/:lang/`) and algorithm challenges (`server/algorithms/:lang/`).

- **Centralized API client**: All frontend API calls go through `apiClient.ts`, which handles base URL resolution, credentials, JSON parsing, and error normalization. No raw `fetch()` calls anywhere in the frontend — every service function is a one-liner that calls `api.get()` or `api.post()`.

- **CurriculumContext — fetch once, use everywhere**: The curriculum (courses + lessons list) is fetched once in a `CurriculumProvider` at app startup. Every page and hook accesses curriculum data via `useCurriculum()` — no duplicate API calls, no per-page loading waterfalls.

- **AuthContext over per-page auth checks**: A single `AuthContext` provider wraps the entire app and checks `/auth/me` once on mount. Every page and component accesses auth state via `useAuth()` — no duplicate fetch calls, no prop drilling, and login/logout state updates propagate everywhere instantly.

- **Test-driven lesson completion**: Lessons are completed by passing all test cases, not by clicking a button. This ensures learners actually solve the exercise. Test cases are defined as JSON files on disk alongside lesson content, supporting exact match, contains, line-based checks, variable overrides (for testing different inputs), and code appending (for testing function definitions).

- **Design tokens via CSS variables, not Tailwind config**: Colors, fonts, radii, and shadows are declared once in `client/index.css` as `--accent`, `--bg`, `--bg2`, `--surface`, etc. Components reference them through Tailwind's arbitrary-value syntax (`bg-[var(--accent)]`, `text-[var(--text2)]`). Re-theming or building a light mode is a matter of overriding a handful of variables; no rebuild or component changes required. The values came from a Claude Design handoff spec — see `client/index.css` for the full palette.

- **Gamification derived, not stored**: XP, level, and badges are computed on the client from `UserLessonProgress` data already in the DB (`useGamification.ts` hook). XP per lesson is non-linear — later lessons in a course award more XP (formula in `shared/constants.ts`). Leveling follows a progressive formula where each level requires 50 more XP than the last. 8 badges unlock at lesson-count thresholds and on course completion. No new tables, no new endpoints, no risk of XP and progress drifting out of sync. Streak is currently localStorage-based — adding it server-side would require a `user_activity` table to track daily logins.

- **`npm run dev` does everything**: The `dev` script runs `db:prepare` (Prisma generate + migrate deploy + seed) before starting the servers. Adding a lesson or migration requires zero manual database commands — just edit the files and restart. The seed is idempotent (`upsert`), so it's safe to run on every startup.

- **Docker for code execution in all environments**: User code runs inside sandboxed Docker containers in both development and production. Containers run with `--network=none`, memory and PID limits, and isolated per-run temp directories — the same security guarantees apply everywhere. The `code-execution.service` exposes a single `execute(code, language)` interface so the rest of the app is fully decoupled from the execution backend.

- **Language runtime registry**: Per-language config (Docker image, Piston version, source filename, inner shell command) is isolated in `server/runtimes/<lang>.ts` files behind a `LanguageRuntime` interface. The execution service is fully generic — there is no `switch (language)` anywhere in the runner. Adding a new language is one file plus one line in `registry.ts`, with zero changes to the service, controllers, or routes.

- **Sandboxed code execution**: Docker is invoked via `execFile("docker", [...args])` with an argument array — no shell, no string interpolation, no injection surface. Containers run with `--network=none`, memory and PID limits, and the per-run scratch dir lives under `os.tmpdir()` instead of inside the source tree (so `tsx watch` doesn't reload on every execution). CPU is intentionally unbounded so user code can use the full machine when needed; infinite loops are stopped by the `timeout 5` wrapper inside each runtime's inner command. All limits are env-tunable via `CODE_RUN_*` variables.

- **Configuration split**: Environment loading and validation live in `server/config/env.ts` (with a small `required()` helper that throws if a critical variable is missing). The Prisma Client singleton lives in `server/config/db.ts`. `server/config/index.ts` re-exports both, so the rest of the codebase imports configuration from a single place.

- **Vite proxy in development**: The Vite dev server proxies `/api` and `/auth` requests to the Express backend, eliminating CORS issues in development and allowing the frontend to use relative paths. In production, the Express server serves the built SPA directly, so no proxy is needed.
