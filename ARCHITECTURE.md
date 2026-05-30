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

| Method | Endpoint                       | Auth | Description                           |
| ------ | ------------------------------ | ---- | ------------------------------------- |
| GET    | `/api/curriculum`              | No   | List all courses with ordered lessons |
| GET    | `/api/lessons/:lang/:lesson`   | No   | Get lesson Markdown content           |
| GET    | `/api/lesson-code/:lang/:file` | No   | Get starter code template             |

### Code Execution

| Method | Endpoint  | Auth | Description                              |
| ------ | --------- | ---- | ---------------------------------------- |
| WS     | `/ws/run` | No   | Interactive code execution via WebSocket |

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

Containers are locked down with `--network=none`, `--memory=128m`, `--pids-limit=64`, `--cap-drop=ALL`, `--security-opt=no-new-privileges`, `--read-only` (with a small `/tmp` tmpfs for compiler scratch), and `--user=<uid>:<gid>` (the host process's own uid, so the bind-mounted `/work` stays writable after capabilities are dropped). Docker is always invoked with an argument array (no shell interpolation) — `spawn` for the run step, `execFile` for the compile step.

Interactive execution (`/ws/run`) uses a 20s wall-clock timeout that resets on each stdin input, plus a 1MB output cap to stop runaway output loops.

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

| Variable          | Required | Default                   | Description                               |
| ----------------- | -------- | ------------------------- | ----------------------------------------- |
| `DB_USER`         | Yes      | —                         | PostgreSQL user                           |
| `DB_HOST`         | Yes      | —                         | PostgreSQL host                           |
| `DB_NAME`         | Yes      | —                         | Database name                             |
| `DB_PASSWORD`     | Yes      | —                         | Database password                         |
| `DB_PORT`         | No       | `5432`                    | PostgreSQL port                           |
| `DATABASE_URL`    | Yes      | —                         | Prisma CLI connection string              |
| `EXPRESS_PORT`    | No       | `5000`                    | Backend port (dev)                        |
| `PORT`            | No       | `8080`                    | Backend port (production)                 |
| `JWT_SECRET`      | Yes      | —                         | JWT signing secret                        |
| `NODE_ENV`        | No       | `development`             | Environment                               |
| `CORS_DEV_ORIGIN` | No       | `http://localhost:5173`   | CORS origin in dev                        |
| `CORS_ORIGIN`     | No       | `https://cyber-stars.org` | CORS origin in production                 |
| `CODE_RUN_MEMORY` | No       | `128m`                    | Per-container memory limit                |
| `CODE_RUN_PIDS`   | No       | `64`                      | Per-container PID limit                   |
| `SMTP_USER`       | No       | —                         | Gmail SMTP user for password-reset emails |
| `SMTP_PASS`       | No       | —                         | Gmail SMTP app password                   |

## Design decisions

- **Shared types** — `shared/` folder prevents client/server type drift
- **Cookie auth** — httpOnly cookies prevent XSS access to tokens
- **Filesystem lessons** — easy to author with git, metadata in PostgreSQL for querying
- **Derived gamification** — badges computed client-side from `UserLessonProgress` counts, no extra tables
- **CurriculumContext** — curriculum fetched once at startup, shared via context
- **CSS variables** — all theming via custom properties, re-theming is a one-file change
- **`npm run dev` does everything** — DB setup, migration, seeding, server start in one command
