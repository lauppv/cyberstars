# Architecture

CyberStars is a split-screen coding education platform with a React frontend, Express backend, and PostgreSQL database.

## Project structure

The repo is one npm workspace: two apps, two packages they share, and the App Framework's packages.

```
cyberstars/
├── apps/
│   ├── ui/                        # @cyberstars/ui: the React app
│   │   ├── src/                   # Pages, components, contexts, hooks, services, constants, i18n,
│   │   │                          #   seo, index.css
│   │   │   └── components/        # One folder per area: judge, tutor, tour, terminal, layout, ...
│   │   │       ├── visual/        # Step-by-step visuals: parsers, frames, views, VisualPlayer
│   │   │       └── landing/       # The visitor's page on /, its algorithm films in loopVisuals.ts
│   │   ├── public/                # Static files; curriculum.json and lessons/ are generated here
│   │   ├── scripts/               # Pre-renders every public page and the sitemap after the build
│   │   └── index.html             # Page shell; Vite config sits next to it
│   │
│   └── api/                       # @cyberstars/api: the Express server
│       ├── src/                   # Routes → controllers → services → repositories, runtimes, schemas
│       ├── prisma/                # Database schema (source of truth), migrations, seed
│       ├── scripts/               # validate:tests, check:tests, changed lessons, check:tutor
│       └── test/integration/      # Integration tests against a real PostgreSQL
│
├── packages/
│   ├── shared/                    # @cyberstars/shared: types and rules both apps import
│   └── content/                   # @cyberstars/content
│       ├── curriculum.ts          # Every course and its lessons, in order
│       ├── paths.ts               # courseDir: a course key (and language) to its folder
│       ├── visuals.ts             # Puts a multi-language course's named visuals into its lessons
│       ├── lessons/               # Courses: python (60), c (47), java (49), linux (55), and
│       │                          #   trees-graphs (12, Beta) in python/, java/, c/ plus visuals/
│       ├── algorithms/            # Challenge sets: python (20), java (20), c (32), and
│       │                          #   trees-graphs (16, Beta) in python/, java/, c/
│       ├── variants/              # Accepted and rejected solutions per tested lesson
│       └── scripts/               # Static-content generator
│
├── framework/                     # @cyberstars-framework/*: the reusable parts, one package each
│   └── server-kit/                # Settings loader, AppError and its handler, validateBody, limiters
│
├── e2e/                           # Playwright tests that drive the UI and the API together
├── test/                          # Shared Vitest setup (jsdom, jest-dom matchers)
├── deploy/                        # Deploy script, IndexNow ping and nginx maintenance page
└── scripts/                       # Rootless Podman helper
```

Each part has its own `package.json` with only the dependencies it uses. The root keeps the tools every part shares (TypeScript, ESLint, Prettier, Vitest, Playwright, knip) and runs each app's scripts through `npm run <script> -w <workspace>`, so the commands stay the same from the root.

### Why one repo

The UI and the API stay in one repo on purpose:

- **They share a contract.** Both import the same types and rules from `packages/shared` (who is an admin, which features are open, usage limits, XP, the judge's result shape). A change to an API answer and the UI that reads it lands in one PR, and the type check flags the side that didn't follow. Split, the shared code would have to be a published package, and every such change would take three PRs.
- **One language, one toolchain.** Both are TypeScript on Node 24 with one lockfile, one lint config, one formatter and one test runner. Two repos would duplicate that tooling for no gain.
- **They are tested and shipped together.** The E2E tests start both with one command, and in production the API serves the UI's build from one deploy script.

Separate deploys don't need separate repos: workspaces already give each part its own dependencies and checks.

## Backend layers

**Routes → Controllers → Services → Repositories.** Controllers handle HTTP (req/res, cookies), services hold the logic, and repositories are the only place Prisma is used. Every write endpoint runs its body through a Zod schema with `validateBody(schema)` (`@cyberstars-framework/server-kit`), so invalid input never reaches a controller.

## API endpoints

Auth is a JWT in an httpOnly cookie. In the tables, **Yes** is a signed-in student, **Owner** a student or a guest (keyed by the per-browser `guestId` cookie), **Staff** a moderator or admin, **Admin** an admin or the founder. Roles are always read from the database, never from the token.

### Auth

| Method | Endpoint                | Auth | Description                                         |
| ------ | ----------------------- | ---- | --------------------------------------------------- |
| POST   | `/auth/signup`          | No   | Register, set the cookie                            |
| POST   | `/auth/login`           | No   | Sign in, set the cookie                             |
| POST   | `/auth/logout`          | No   | Clear the cookie                                    |
| GET    | `/auth/me`              | Yes  | The current user                                    |
| POST   | `/auth/forgot-password` | No   | Email a reset code (15 min, 3 an hour per email)    |
| POST   | `/auth/reset-password`  | No   | Reset the password with the code (5 tries per code) |

### Lessons and curriculum

Not API routes: static files generated from `packages/content/` at build time into `apps/ui/public/` and fetched by `lessonService`, so they never touch the server or the database.

| File                                | Description                                      |
| ----------------------------------- | ------------------------------------------------ |
| `/curriculum.json`                  | Every course with its lessons in order           |
| `/lessons/:courseKey/:slug.md`      | A lesson (English, the source of truth)          |
| `/lessons/:courseKey/:slug-code.md` | Its starter code                                 |
| `/lessons/:courseKey/ro/:slug.md`   | Its Romanian copy, falling back to English       |
| `/lessons/:courseKey/:language/...` | The same per language on a multi-language course |
| `/almanac/...`                      | Almanac cards and articles, with `ro/` copies    |

### Code execution

| Method | Endpoint       | Auth | Description                                         |
| ------ | -------------- | ---- | --------------------------------------------------- |
| WS     | `/ws/run`      | No   | Run code interactively                              |
| WS     | `/ws/presence` | No   | One per tab; closing it frees the owner's container |

### Progress

| Method | Endpoint                                      | Auth | Description                                       |
| ------ | --------------------------------------------- | ---- | ------------------------------------------------- |
| GET    | `/api/progress/:courseKey`                    | Yes  | Progress in a course                              |
| GET    | `/api/progress/:courseKey/:lessonSlug/code`   | Yes  | Saved code (`?language=` on a multi-language one) |
| PUT    | `/api/progress/:courseKey/:lessonSlug/code`   | Yes  | Save code                                         |
| POST   | `/api/progress/:courseKey/:lessonSlug/access` | Yes  | Record the last visit                             |
| GET    | `/api/daily`                                  | Yes  | Today's lesson and challenge pick and their bonus |

There is no endpoint that marks a lesson complete: only the judge does, on a passing verdict.

### Judge

| Method | Endpoint                                        | Auth  | Description                                                       |
| ------ | ----------------------------------------------- | ----- | ----------------------------------------------------------------- |
| POST   | `/api/tests/:courseKey/:lessonSlug/run`         | Owner | Run the lesson's tests; a pass completes it for a student. 10/min |
| GET    | `/api/tests/:courseKey/:lessonSlug/submissions` | Yes   | The student's last 20 attempts on the lesson                      |
| GET    | `/api/tests/submissions/:id`                    | Yes   | One attempt with its code and the test it stopped on              |

The judge runs the student's code and the reference solution in the owner's container and compares the outputs on the server, so the expected output never reaches the container. It stops at the first failing test and never shows a hidden test's expected output.

### Terminal (Linux course)

| Method | Endpoint                    | Auth  | Description                                            |
| ------ | --------------------------- | ----- | ------------------------------------------------------ |
| POST   | `/api/terminal/session`     | Owner | Open a sandboxed terminal                              |
| POST   | `/api/terminal/exec`        | Owner | Run a command (30/min)                                 |
| POST   | `/api/terminal/check`       | Owner | Check the sandbox's state; a pass completes the lesson |
| DELETE | `/api/terminal/session/:id` | Owner | Close the terminal                                     |

### Forum

| Method | Endpoint                              | Auth  | Description             |
| ------ | ------------------------------------- | ----- | ----------------------- |
| GET    | `/api/forum/categories`               | Yes   | List categories         |
| POST   | `/api/forum/categories`               | Staff | Create a category       |
| PUT    | `/api/forum/categories/:slug`         | Staff | Edit a category         |
| DELETE | `/api/forum/categories/:slug`         | Staff | Delete a category       |
| GET    | `/api/forum/categories/:slug/threads` | Yes   | A category's threads    |
| GET    | `/api/forum/threads/:id`              | Yes   | A thread with its posts |
| POST   | `/api/forum/threads`                  | Yes   | Start a thread          |
| POST   | `/api/forum/threads/:id/posts`        | Yes   | Reply                   |
| DELETE | `/api/forum/threads/:id`              | Yes   | Delete (owner or admin) |
| POST   | `/api/forum/posts/:id/reactions`      | Yes   | Toggle a reaction       |
| POST   | `/api/forum/posts/:id/solution`       | Yes   | Mark the solution       |
| PUT    | `/api/forum/posts/:id`                | Yes   | Edit a post             |
| DELETE | `/api/forum/posts/:id`                | Yes   | Soft-delete a post      |
| PUT    | `/api/forum/users/:id/role`           | Admin | Change a user's role    |

### Support

| Method | Endpoint                            | Auth  | Description                      |
| ------ | ----------------------------------- | ----- | -------------------------------- |
| POST   | `/api/support/tickets`              | Yes   | Open a ticket                    |
| GET    | `/api/support/tickets/mine`         | Yes   | The student's tickets            |
| GET    | `/api/support/tickets`              | Admin | Every ticket                     |
| PUT    | `/api/support/tickets/:id/status`   | Yes   | Change the status (owner: close) |
| GET    | `/api/support/tickets/:id/messages` | Yes   | A ticket's messages              |
| POST   | `/api/support/tickets/:id/messages` | Yes   | Reply                            |

### Notifications, messages and connections

| Method | Endpoint                               | Auth | Description                             |
| ------ | -------------------------------------- | ---- | --------------------------------------- |
| GET    | `/api/notifications`                   | Yes  | Notifications and the unread count      |
| POST   | `/api/notifications/read`              | Yes  | Mark read up to an id                   |
| POST   | `/api/notifications/:id/read`          | Yes  | Mark one read                           |
| WS     | `/ws/user`                             | Yes  | Pushes new notifications and messages   |
| GET    | `/api/messages/conversations`          | Yes  | Inbox with unread counts                |
| POST   | `/api/messages/conversations`          | Yes  | Open (or find) a conversation           |
| GET    | `/api/messages/conversations/:id`      | Yes  | Message history, paged                  |
| POST   | `/api/messages/conversations/:id`      | Yes  | Send a message                          |
| POST   | `/api/messages/conversations/:id/read` | Yes  | Mark read up to an id                   |
| PATCH  | `/api/messages/:messageId`             | Yes  | Edit own message                        |
| DELETE | `/api/messages/:messageId`             | Yes  | Soft-delete own message                 |
| POST   | `/api/messages/:messageId/reactions`   | Yes  | Toggle a reaction                       |
| GET    | `/api/connections`                     | Yes  | Connections and pending requests        |
| POST   | `/api/connections`                     | Yes  | Send a request                          |
| POST   | `/api/connections/:id/accept`          | Yes  | Accept (addressee only)                 |
| POST   | `/api/connections/:id/decline`         | Yes  | Decline (addressee only)                |
| DELETE | `/api/connections/:id`                 | Yes  | Cancel a request or remove a connection |

The actor never gets their own notification, and repeat replies or reactions collapse into one unread row.

### Profile, leaderboard and public profiles

| Method | Endpoint                     | Auth | Description                                         |
| ------ | ---------------------------- | ---- | --------------------------------------------------- |
| PATCH  | `/api/profile`               | Yes  | Bio, status and the four privacy flags              |
| PUT    | `/api/profile/interests`     | Yes  | What the student wants to learn                     |
| PUT    | `/api/profile/code-language` | Yes  | The language picked on a multi-language course      |
| POST   | `/api/profile/avatar`        | Yes  | Upload an avatar                                    |
| DELETE | `/api/profile/avatar`        | Yes  | Remove it                                           |
| POST   | `/api/profile/password`      | Yes  | Change the password                                 |
| POST   | `/api/profile/email/request` | Yes  | Send a code to a new email                          |
| POST   | `/api/profile/email/confirm` | Yes  | Confirm it with the code                            |
| DELETE | `/api/profile/email/pending` | Yes  | Cancel a pending change                             |
| GET    | `/api/profile/activity`      | Yes  | Streak and last activity                            |
| GET    | `/api/leaderboard`           | Yes  | Students ranked by XP                               |
| GET    | `/api/leaderboard/me`        | Yes  | The student's own rank                              |
| GET    | `/api/users/:id/profile`     | Yes  | A public profile, its sections behind privacy flags |

### Tutor and usage

| Method | Endpoint                                     | Auth | Description                                                    |
| ------ | -------------------------------------------- | ---- | -------------------------------------------------------------- |
| POST   | `/api/tutor/chat`                            | Yes  | One message in, the answer streamed back as server-sent events |
| GET    | `/api/tutor/conversations`                   | Yes  | The student's conversations, newest first                      |
| GET    | `/api/tutor/conversations/:id`               | Yes  | One conversation's messages, paged                             |
| DELETE | `/api/tutor/conversations/:id`               | Yes  | Delete one                                                     |
| GET    | `/api/usage`                                 | Yes  | What is left of Show Solution and the tutor session            |
| POST   | `/api/usage/solution/:courseKey/:lessonSlug` | Yes  | Reveal a lesson's solution, taking one of 3 a day              |

### Laniakea

| Method | Endpoint                          | Auth | Description                                            |
| ------ | --------------------------------- | ---- | ------------------------------------------------------ |
| GET    | `/api/laniakea`                   | Yes  | Whether the game is open, and every planet's state     |
| POST   | `/api/laniakea/:slug/quiz`        | Yes  | Open a 10-question test on a planet, or resume it      |
| POST   | `/api/laniakea/:slug/quiz/answer` | Yes  | Answer the next question and get the right option back |

### Admin and visits

| Method | Endpoint                   | Auth     | Description                                                   |
| ------ | -------------------------- | -------- | ------------------------------------------------------------- |
| GET    | `/api/admin/stats`         | Admin    | Platform stats (cached 5 min) and live code-execution metrics |
| GET    | `/api/admin/visits`        | Admin    | Visitors a day, top pages, sources and clicks over a range    |
| GET    | `/api/admin/visits/guests` | Admin    | Guest visits with their steps, paged                          |
| POST   | `/api/visits`              | Optional | The app reports a page it showed; bots are left out           |
| POST   | `/api/visits/steps`        | Optional | A guest's clicks and scrolls on the page they're on           |

Visits keep no IP and no guest id: a visitor is a hash of the day's salt, the IP and the user agent, and the salt is gone with its day.

## Database schema

Defined in [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma), camelCase in TypeScript mapped to snake_case columns.

- **User**, **Curriculum**, **Lesson**: accounts, courses and lesson metadata (the content stays in files)
- **UserLessonProgress**, **UserSavedCode**, **LessonSubmission**, **DailyPick**: completion, saved code, judge attempts (the newest 20 per lesson) and the daily picks
- **ForumCategory**, **ForumThread**, **ForumPost**, **ForumReaction**, **ForumThreadView**: the forum
- **SupportTicket**, **SupportMessage**, **Notification**: support and the bell
- **Conversation**, **DirectMessage**, **DmReaction**, **Connection**: messages and connections
- **TutorConversation**, **TutorMessage**, **UsageWindow**: the tutor's conversations and the usage limits
- **LaniakeaPlanet**: a student's planet: level, last pass, questions seen and the test going on
- **PageVisit**, **VisitSalt**, **VisitTotal**, **GuestVisit**, **VisitStep**: visitor counts

## Code execution

Code runs in Docker on the server, never in the browser: `python:3.10-slim`, `gcc:latest` and `eclipse-temurin:21-jdk-alpine`, plus `cyberstars-linux-sandbox` for the terminal.

- **One container per owner**, on the language they last ran, reused across runs and swapped on a language change, dropped after 15 minutes idle or when the global cap (`CODE_MAX_CONTAINERS`) needs room (`code-container.service.ts`).
- **Locked down**: no network, 128 MB, 64 processes, no capabilities, a read-only root, an unprivileged uid (`SANDBOX_UID`), and tmpfs for `/work` and `/tmp`. Docker always gets an argument array, never a shell string.
- **Limits**: 20 s per run (restarting with each line of input), 1 MB of output, 10 runs a minute per owner, and at most `SANDBOX_MAX_BUSY` sandboxes busy at once across the server; past it a run waits up to 30 s and the student sees a notice. Guests also get 10 runs in all and share limits per IP.
- **Cleanup**: a timeout or an abandoned run destroys the container; a normal exit kills what the program left behind and keeps it. The server removes every labelled sandbox when it starts.

To add a language, implement `LanguageRuntime` in `apps/api/src/runtimes/<lang>.ts` and register it in `registry.ts`.

## Lesson format

A lesson is `<slug>.md` (the text, with runnable code blocks) and `<slug>-code.md` (the starter) in `packages/content/lessons/<course>/`, with an optional Romanian copy in `ro/`.

- **Tests**: `<slug>-tests.json` and `<slug>-solution.md` make it completable. The judge runs both programs on every case and compares the outputs; passing is the only way to complete a lesson.
- **Variants**: `packages/content/variants/<course>/<slug>/` holds other correct solutions (`accept-*`, must pass) and cheats or near misses (`reject-*`, must fail). `npm run check:tests` grades them with the solution, and CI does it for the lessons a PR changes.
- **Hidden part**: a challenge may ship `<slug>-harness.md`, the program around the function the student writes, LeetCode-style, with a `{{code: <name>}}` placeholder where their code goes. It stays on the server, like solutions.
- **Multi-language courses** (`trees-graphs` and its challenges) keep every lesson in `python/`, `java/` and `c/`, each with its own `ro/`. The build stops when a language lacks a file its Python twin has.
- **Visuals**: a ` ```visual ` fence holds JSON that draws an array, `boxes`, a `tree`, a `graph`, a `grid` or a `stack`, played a step at a time; a step may ask what comes next. A multi-language course writes each once in `lessons/<course>/visuals/<name>.json` and names it with `{"use": "<name>"}`. `lessonVisuals.test.ts` checks every visual and that the Romanian ones match.

## Environment variables

| Variable                   | Required | Default                               | Description                                                                      |
| -------------------------- | -------- | ------------------------------------- | -------------------------------------------------------------------------------- |
| `DB_USER`                  | Yes      | none                                  | PostgreSQL user                                                                  |
| `DB_HOST`                  | Yes      | none                                  | PostgreSQL host                                                                  |
| `DB_NAME`                  | Yes      | none                                  | Database name                                                                    |
| `DB_PASSWORD`              | Yes      | none                                  | Database password                                                                |
| `DB_PORT`                  | No       | `5432`                                | PostgreSQL port                                                                  |
| `DATABASE_URL`             | Yes      | none                                  | Prisma CLI connection string                                                     |
| `EXPRESS_PORT`             | No       | `5000`                                | Backend port (dev)                                                               |
| `PORT`                     | No       | `8080`                                | Backend port (production)                                                        |
| `JWT_SECRET`               | Yes      | none                                  | JWT signing secret                                                               |
| `FOUNDER_EMAIL`            | No       | none                                  | Account that always registers as the unique FOUNDER                              |
| `NODE_ENV`                 | No       | `development`                         | Environment                                                                      |
| `CORS_DEV_ORIGIN`          | No       | `http://localhost:5173`               | Allowed origins in dev (CORS + WebSockets), comma-separated                      |
| `CORS_ORIGIN`              | No       | `https://cyberstars.app`              | Allowed origins in production (CORS + WebSockets), comma-separated               |
| `CODE_RUN_MEMORY`          | No       | `128m`                                | Per-container memory limit                                                       |
| `CODE_RUN_PIDS`            | No       | `64`                                  | Per-container PID limit                                                          |
| `CODE_RUN_CPUS`            | No       | `0.5`                                 | Per-container CPU cap                                                            |
| `CODE_MAX_CONTAINERS`      | No       | `50`                                  | Global cap on concurrent run containers (LRU-evicted)                            |
| `CODE_CONTAINER_IDLE_MS`   | No       | `900000`                              | Idle TTL before a run container is GC'd (15 min)                                 |
| `GUEST_RUN_BUDGET`         | No       | `10`                                  | Lifetime code runs a guest gets before a sign-up nudge                           |
| `GUEST_IP_RUNS_PER_WINDOW` | No       | `60`                                  | Guest code runs per minute shared by one client IP, whatever the guest id        |
| `GUEST_IP_MAX_ACTIVE_RUNS` | No       | `10`                                  | Concurrent guest code runs per client IP                                         |
| `GUEST_IP_MAX_SANDBOXES`   | No       | `10`                                  | Sandboxes (editor + terminal, busy or idle) guests from one client IP may hold   |
| `JUDGE_MAX_CONCURRENT`     | No       | `2`                                   | Judge runs at once; the rest wait their turn                                     |
| `JUDGE_QUEUE_TIMEOUT_MS`   | No       | `20000`                               | How long a judge run waits for its turn before a 503                             |
| `SANDBOX_MAX_BUSY`         | No       | 4 per CPU core                        | Sandboxes busy at once across the server (editor, Run Tests, terminal)           |
| `SANDBOX_QUEUE_TIMEOUT_MS` | No       | `30000`                               | How long a run waits for a free sandbox slot before "the server is busy"         |
| `SANDBOX_STOP_AFTER_MS`    | No       | `20000`                               | An editor run holding its slot this long is stopped when another run waits       |
| `SANDBOX_UID`              | No       | `10001`                               | Unprivileged uid (and gid) the editor and Run Tests sandboxes run as             |
| `SANDBOX_RUN_AS_USER`      | No       | `true`                                | Run sandboxes as `SANDBOX_UID`; set `false` under rootless Podman                |
| `TERMINAL_MAX_SESSIONS`    | No       | `50`                                  | Global cap on concurrent Linux terminal sandboxes                                |
| `LEADERBOARD_CACHE_MS`     | No       | `180000`                              | Leaderboard cache TTL (3 min)                                                    |
| `ADMIN_STATS_CACHE_MS`     | No       | `300000`                              | Admin stats cache TTL (5 min)                                                    |
| `RESEND_API_KEY`           | No       | none                                  | Resend key for reset and email-change codes; empty logs the codes to the console |
| `RESEND_FROM`              | No       | `CyberStars <noreply@cyberstars.app>` | Sender for those emails                                                          |
| `GEMINI_API_KEY`           | No       | none                                  | Gemini key for the tutor; empty disables it                                      |
| `GEMINI_MODEL`             | No       | `gemini-flash-lite-latest`            | Gemini model used for the tutor                                                  |
| `VITE_PROD_API_URL`        | No       | none                                  | Client API base URL in production; empty means same origin                       |

## Design decisions

- **Shared types**: the `packages/shared` workspace prevents client/server type drift
- **Cookie auth**: httpOnly cookies prevent XSS access to tokens
- **Filesystem lessons**: easy to author with git, metadata in PostgreSQL for querying
- **Derived gamification**: badges computed client-side from `UserLessonProgress` counts; XP/levels derived from judge-completed lessons (the server recomputes XP authoritatively, never storing or trusting a client value), no extra gamification tables
- **CurriculumContext**: curriculum fetched once at startup, shared via context
- **CSS variables**: all theming via custom properties, re-theming is a one-file change
- **`npm run dev` does everything**: DB setup, migration, seeding, server start in one command
- **i18n with English fallback**: English is the source of truth; UI strings in `apps/ui/src/i18n/locales/{en,ro}.json`, content translations in `/ro` subfolders that fall back to English, so the site stays usable while translation lags
