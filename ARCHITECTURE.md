# Architecture

CyberStars is a split-screen coding education platform with a React frontend, Express backend, and PostgreSQL database.

## Project structure

```
cyberstars/
├── shared/                        # DTO types + constants (imported by both client and server)
│   ├── constants.ts               # Progress %, course key constants
│   ├── auth.ts                    # Auth-related types
│   ├── lesson.ts                  # LessonContent, LessonMeta, Course
│   ├── progress.ts                # CourseProgress, LessonProgressItem
│   ├── forum.ts                   # Forum DTO types
│   ├── support.ts                 # Support ticket DTO types
│   └── terminal.ts                # Terminal session types
│
├── prisma/
│   ├── schema.prisma              # Database schema (source of truth)
│   ├── seed.ts                    # Curriculum seeder (idempotent via upsert)
│   └── migrations/
│
├── server/
│   ├── server.ts                  # Express entry point
│   ├── config/                    # Environment, Prisma client singleton
│   ├── schemas/                   # Zod request validation schemas
│   ├── middleware/                 # Auth (JWT), validation, error handler
│   ├── repositories/              # Data access (Prisma only, no business logic)
│   ├── services/                  # Business logic (no req/res, no SQL)
│   ├── controllers/               # Thin req/res layer
│   ├── routes/                    # Route wiring + middleware
│   ├── runtimes/                  # Per-language Docker execution config
│   ├── lessons/                   # Lesson Markdown content (python, c, java, linux)
│   └── algorithms/                # Algorithm challenge content
│
├── client/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Router, context providers
│   ├── index.css                  # Design tokens (CSS variables), global styles
│   ├── constants/                 # Course metadata (icons, colors, labels)
│   ├── services/                  # API client + per-feature service wrappers
│   ├── context/                   # AuthContext, CurriculumContext, ProgressContext
│   ├── hooks/                     # useLesson, useCodeExecution, useProgress, useGamification
│   ├── components/                # UI, layout, code editor, markdown renderer
│   └── pages/                     # Route pages
│
└── test/                          # Test setup (jsdom, jest-dom matchers)
```

## Backend layers

The backend follows **Controller → Service → Repository** separation:

- **Controllers** handle HTTP concerns (req/res, cookies)
- **Services** contain business logic (password hashing, token creation, progress aggregation)
- **Repositories** are the only place Prisma is used

Every write endpoint is wrapped in `validateBody(schema)` middleware that parses the body through a Zod schema. Invalid input never reaches a controller.

## API endpoints

Authentication uses httpOnly JWT cookies. Protected endpoints require the `token` cookie set by login/signup.

### Auth

| Method | Endpoint                | Auth | Description                              |
| ------ | ----------------------- | ---- | ---------------------------------------- |
| POST   | `/auth/signup`          | No   | Register user, set JWT cookie            |
| POST   | `/auth/login`           | No   | Login, set JWT cookie                    |
| POST   | `/auth/logout`          | No   | Clear JWT cookie                         |
| GET    | `/auth/me`              | Yes  | Get current user                         |
| POST   | `/auth/forgot-password` | No   | Send reset code via email (15min expiry) |
| POST   | `/auth/reset-password`  | No   | Reset password with code                 |

### Curriculum & Lessons

Curriculum structure and lesson content are **static files**, not API routes —
generated at build time by `scripts/generate-static-content.ts` (from the seed
data in `prisma/curriculum.data.ts` and the markdown under `server/lessons` /
`server/algorithms`) and served from `public/` (Vite's publicDir in dev,
`express.static`/nginx in prod). The client fetches them directly via
`client/services/lessonService.ts`, so they never touch the API server or the DB.

| Asset                               | Description                      |
| ----------------------------------- | -------------------------------- |
| `/curriculum.json`                  | All courses with ordered lessons |
| `/lessons/:courseKey/:slug.md`      | Lesson Markdown content          |
| `/lessons/:courseKey/:slug-code.md` | Starter code template            |

### Code Execution

| Method | Endpoint       | Auth | Description                                            |
| ------ | -------------- | ---- | ------------------------------------------------------ |
| WS     | `/ws/run`      | No   | Interactive code execution via WebSocket               |
| WS     | `/ws/presence` | No   | Per-tab keep-alive; closing it frees the run container |

### Progress (all authenticated)

| Method | Endpoint                                        | Auth | Description               |
| ------ | ----------------------------------------------- | ---- | ------------------------- |
| GET    | `/api/progress/:courseKey`                      | Yes  | Get progress for a course |
| POST   | `/api/progress/:courseKey/:lessonSlug/complete` | Yes  | Mark lesson complete      |
| GET    | `/api/progress/:courseKey/:lessonSlug/code`     | Yes  | Get saved code            |
| PUT    | `/api/progress/:courseKey/:lessonSlug/code`     | Yes  | Save code                 |
| POST   | `/api/progress/:courseKey/:lessonSlug/access`   | Yes  | Track last access time    |

### Forum

| Method | Endpoint                              | Auth     | Description                 |
| ------ | ------------------------------------- | -------- | --------------------------- |
| GET    | `/api/forum/categories`               | No       | List forum categories       |
| GET    | `/api/forum/categories/:slug/threads` | No       | List threads in category    |
| GET    | `/api/forum/threads/:id`              | Optional | Get thread with posts       |
| POST   | `/api/forum/threads`                  | Yes      | Create thread               |
| POST   | `/api/forum/threads/:id/posts`        | Yes      | Reply to thread             |
| DELETE | `/api/forum/threads/:id`              | Yes      | Delete thread (owner/admin) |
| POST   | `/api/forum/posts/:id/reactions`      | Yes      | Toggle reaction             |
| POST   | `/api/forum/posts/:id/solution`       | Yes      | Mark post as solution       |
| PUT    | `/api/forum/posts/:id`                | Yes      | Edit post                   |
| DELETE | `/api/forum/posts/:id`                | Yes      | Soft-delete post            |
| PUT    | `/api/forum/users/:id/role`           | Admin    | Update user role            |

### Terminal (Linux sandbox)

| Method | Endpoint                    | Auth | Description                       |
| ------ | --------------------------- | ---- | --------------------------------- |
| POST   | `/api/terminal/session`     | Yes  | Create sandboxed terminal session |
| POST   | `/api/terminal/exec`        | Yes  | Execute command in session        |
| DELETE | `/api/terminal/session/:id` | Yes  | Destroy session                   |

### Support

| Method | Endpoint                            | Auth  | Description        |
| ------ | ----------------------------------- | ----- | ------------------ |
| POST   | `/api/support/tickets`              | Yes   | Create ticket      |
| GET    | `/api/support/tickets/mine`         | Yes   | Get user's tickets |
| GET    | `/api/support/tickets`              | Admin | Get all tickets    |
| PUT    | `/api/support/tickets/:id/status`   | Yes   | Update status      |
| GET    | `/api/support/tickets/:id/messages` | Yes   | Get messages       |
| POST   | `/api/support/tickets/:id/messages` | Yes   | Add reply          |

### Profile

| Method | Endpoint              | Auth | Description                  |
| ------ | --------------------- | ---- | ---------------------------- |
| PATCH  | `/api/profile`        | Yes  | Update profile (bio, status) |
| POST   | `/api/profile/avatar` | Yes  | Upload avatar                |
| DELETE | `/api/profile/avatar` | Yes  | Remove avatar                |

## Database schema

Defined in [`prisma/schema.prisma`](../prisma/schema.prisma). Field names use camelCase in TypeScript, mapped to snake_case columns via Prisma's `@map`.

### Models

- **User** — account data (name, email, hashed password)
- **Curriculum** — course definitions (key, title, description, sortOrder)
- **Lesson** — lesson metadata (courseKey, slug, title, sortOrder)
- **UserLessonProgress** — per-user completion tracking
- **UserSavedCode** — per-user saved code per lesson
- **ForumCategory / ForumThread / ForumPost / ForumReaction** — community forum
- **SupportTicket / SupportMessage** — support system

### Key relationships

```
User (1) → (N) UserLessonProgress    (ON DELETE CASCADE)
User (1) → (N) UserSavedCode         (ON DELETE CASCADE)
Curriculum.key ← Lesson.courseKey     (logical, not FK)
```

Lesson content is stored as Markdown files on disk, not in the database. The `Lesson` table stores metadata while content is read from `server/lessons/` at request time.

## Code execution

User code runs in Docker containers, never in the browser.

| Language | Docker Image                    | Behavior                                |
| -------- | ------------------------------- | --------------------------------------- |
| Python   | `python:3.10-slim`              | Run with `-u` (unbuffered), 20s timeout |
| C        | `gcc:latest`                    | Compile with `-Wall`, 20s timeout       |
| Java     | `eclipse-temurin:21-jdk-alpine` | `javac` + run with 20s timeout          |

**One persistent container per owner.** Each owner — a logged-in user, or a guest keyed by a per-browser `guestId` cookie — gets a single long-lived container for the language they're currently running, created lazily on their first run and managed by `code-container.service.ts`. It is reused across runs (the cold start is paid once), swapped when they switch language (the previous one is torn down on the first run of the new language), garbage-collected after 15 min idle, and bounded by a global LRU cap. `interactive-execution.service.ts` writes the source into the container's `/work` tmpfs and `docker exec`s the compile/run there.

Containers are locked down with `--network=none`, `--memory=128m`, `--pids-limit=64`, `--cap-drop=ALL`, `--security-opt=no-new-privileges`, `--read-only`, and `--user=<uid>:<gid>` (the host process's own uid). `/work` and `/tmp` are tmpfs mounts owned by that uid; `/work` is mounted `exec` so compiled C binaries can run under the read-only rootfs. Docker is always invoked with an argument array (no shell interpolation).

Interactive execution (`/ws/run`) uses a 20s wall-clock timeout that resets on each stdin input, plus a 1MB output cap to stop runaway output loops. On timeout, output-cap, or the page being abandoned mid-run the container is destroyed (reliably killing the program); on a normal exit it is kept for reuse. A separate `/ws/presence` connection (one per tab) lets the server tear the idle container down promptly when the tab closes — the 15 min GC is the backstop. `attachRunWebSocket` routes both WS paths through one manual `noServer` upgrade handler.

**Rate limits & guests.** Editor runs are capped at 10 runs / 60 s per owner (same for guests and logged-in) plus 5 concurrent; guests additionally get a lifetime budget of 10 runs (`guest-budget.service.ts`) before a sign-up nudge. The terminal exec route is capped at 30/min per user with a friendly retry-after message.

### Adding a new language

1. Create `server/runtimes/<lang>.ts` implementing the `LanguageRuntime` interface
2. Register it in `server/runtimes/registry.ts`

No changes to services, controllers, or routes needed.

## Lesson format

Each lesson consists of two files in `server/lessons/:lang/`:

- `<slug>.md` — educational content with runnable code blocks
- `<slug>-code.md` — starter code template

Lessons have no automated grading: students run their code and click "Mark Complete" themselves.

## Environment variables

| Variable                 | Required | Default                   | Description                                            |
| ------------------------ | -------- | ------------------------- | ------------------------------------------------------ |
| `DB_USER`                | Yes      | —                         | PostgreSQL user                                        |
| `DB_HOST`                | Yes      | —                         | PostgreSQL host                                        |
| `DB_NAME`                | Yes      | —                         | Database name                                          |
| `DB_PASSWORD`            | Yes      | —                         | Database password                                      |
| `DB_PORT`                | No       | `5432`                    | PostgreSQL port                                        |
| `DATABASE_URL`           | Yes      | —                         | Prisma CLI connection string                           |
| `EXPRESS_PORT`           | No       | `5000`                    | Backend port (dev)                                     |
| `PORT`                   | No       | `8080`                    | Backend port (production)                              |
| `JWT_SECRET`             | Yes      | —                         | JWT signing secret                                     |
| `NODE_ENV`               | No       | `development`             | Environment                                            |
| `CORS_DEV_ORIGIN`        | No       | `http://localhost:5173`   | CORS origin in dev                                     |
| `CORS_ORIGIN`            | No       | `https://cyber-stars.org` | CORS origin in production                              |
| `CODE_RUN_MEMORY`        | No       | `128m`                    | Per-container memory limit                             |
| `CODE_RUN_PIDS`          | No       | `64`                      | Per-container PID limit                                |
| `CODE_MAX_CONTAINERS`    | No       | `50`                      | Global cap on concurrent run containers (LRU-evicted)  |
| `CODE_CONTAINER_IDLE_MS` | No       | `900000`                  | Idle TTL before a run container is GC'd (15 min)       |
| `GUEST_RUN_BUDGET`       | No       | `10`                      | Lifetime code runs a guest gets before a sign-up nudge |
| `SMTP_USER`              | No       | —                         | Gmail SMTP user for password-reset emails              |
| `SMTP_PASS`              | No       | —                         | Gmail SMTP app password                                |

## Design decisions

- **Shared types** — `shared/` folder prevents client/server type drift
- **Cookie auth** — httpOnly cookies prevent XSS access to tokens
- **Filesystem lessons** — easy to author with git, metadata in PostgreSQL for querying
- **Derived gamification** — badges computed client-side from `UserLessonProgress` counts, no extra tables
- **CurriculumContext** — curriculum fetched once at startup, shared via context
- **CSS variables** — all theming via custom properties, re-theming is a one-file change
- **`npm run dev` does everything** — DB setup, migration, seeding, server start in one command
