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

The backend follows **Controller → Service → Repository** separation:

- **Controllers** handle HTTP concerns (req/res, cookies)
- **Services** contain business logic (password hashing, token creation, progress aggregation)
- **Repositories** are the only place Prisma is used

Every write endpoint is wrapped in `validateBody(schema)` middleware (from `@cyberstars-framework/server-kit`) that parses the body through a Zod schema. Invalid input never reaches a controller.

## API endpoints

Authentication uses httpOnly JWT cookies. Protected endpoints require the `token` cookie set by login/signup.

### Auth

| Method | Endpoint                | Auth | Description                                                   |
| ------ | ----------------------- | ---- | ------------------------------------------------------------- |
| POST   | `/auth/signup`          | No   | Register user, set JWT cookie                                 |
| POST   | `/auth/login`           | No   | Login, set JWT cookie                                         |
| POST   | `/auth/logout`          | No   | Clear JWT cookie                                              |
| GET    | `/auth/me`              | Yes  | Get current user                                              |
| POST   | `/auth/forgot-password` | No   | Send reset code via email (15min expiry, 3 an hour per email) |
| POST   | `/auth/reset-password`  | No   | Reset password with code (5 tries per code)                   |

### Curriculum & Lessons

Curriculum structure and lesson content are **static files**, not API routes,
generated at build time by `packages/content/scripts/generate-static-content.ts`
(from the curriculum in `packages/content/curriculum.ts` and the markdown under
`packages/content/lessons` / `packages/content/algorithms`, with a multi-language
course's visuals put into its lessons on the way) and served from
`apps/ui/public/` (Vite's publicDir in dev, `express.static`/nginx in prod). The
client fetches them directly via `apps/ui/src/services/lessonService.ts`, so they
never touch the API server or the DB.

| Asset                               | Description                                            |
| ----------------------------------- | ------------------------------------------------------ |
| `/curriculum.json`                  | All courses with ordered lessons                       |
| `/lessons/:courseKey/:slug.md`      | Lesson Markdown content (English, source of truth)     |
| `/lessons/:courseKey/:slug-code.md` | Starter code template                                  |
| `/lessons/:courseKey/ro/:slug.md`   | Romanian translation (optional)                        |
| `/lessons/:courseKey/:language/...` | The same files per language on a multi-language course |
| `/almanac/{index,extras}.json`      | Almanac cards + sidebar data (English) and `ro/` peers |
| `/almanac/articles/:slug.json`      | Almanac article body (English) and `ro/` peer          |

**Localization**: the UI is bilingual (English + Romanian), toggled in
`/settings`; the choice persists in `localStorage` and is read from `i18n.language`.
UI chrome strings come from `apps/ui/src/i18n/locales/{en,ro}.json`. Lesson and almanac
content is localized by file: translated copies live in a per-language subfolder
(`ro`) beside the English source, with the **same slug**. `lessonService` /
`almanacService` request the localized path and **fall back to English** when the
translation is missing (a 404 in prod, the SPA `index.html` in dev, both
rejected), so content can be translated incrementally and English-only content
works in both languages. Lesson/course titles come from `curriculum.json` and are
not localized per-language.

### Code Execution

| Method | Endpoint       | Auth | Description                                            |
| ------ | -------------- | ---- | ------------------------------------------------------ |
| WS     | `/ws/run`      | No   | Interactive code execution via WebSocket               |
| WS     | `/ws/presence` | No   | Per-tab keep-alive; closing it frees the run container |

### Progress (all authenticated)

| Method | Endpoint                                      | Auth | Description                                              |
| ------ | --------------------------------------------- | ---- | -------------------------------------------------------- |
| GET    | `/api/progress/:courseKey`                    | Yes  | Get progress for a course                                |
| GET    | `/api/progress/:courseKey/:lessonSlug/code`   | Yes  | Get saved code (`?language=` on a multi-language course) |
| PUT    | `/api/progress/:courseKey/:lessonSlug/code`   | Yes  | Save code (`{ code, language? }`)                        |
| POST   | `/api/progress/:courseKey/:lessonSlug/access` | Yes  | Track last access time                                   |

There is **no client-writable completion endpoint**; completion is server-authoritative
and only ever set by the judge (see below) when tests pass for a logged-in user.

### Daily picks

| Method | Endpoint     | Auth | Description                                                                    |
| ------ | ------------ | ---- | ------------------------------------------------------------------------------ |
| GET    | `/api/daily` | Yes  | Today's lesson and algorithm pick, the same for everyone, plus the bonus ratio |

Completing a pick on its day adds a one-time XP bonus.

### Judge (lesson tests)

| Method | Endpoint                                        | Auth  | Description                                                                                                                                                                                                                                    |
| ------ | ----------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/tests/:courseKey/:lessonSlug/run`         | Owner | Run the lesson's test suite (`{ code, lang?, language? }`, `language` picking the language on a multi-language course); marks complete on a `passed` verdict (logged-in only). Works for guests (they can run but not save). 10 runs/min/owner |
| GET    | `/api/tests/:courseKey/:lessonSlug/submissions` | Yes   | The signed-in student's last 20 attempts on the lesson, newest first. 60/min/user                                                                                                                                                              |
| GET    | `/api/tests/submissions/:id`                    | Yes   | One attempt with its code and the test it stopped on; someone else's attempt is a 404. 60/min/user                                                                                                                                             |

"Owner" means a logged-in user or a guest keyed by the per-browser `guestId` cookie.
The judge runs the student's code (and the reference solution) in the owner's warm
Docker container and compares outputs **on the server**, so expected output never enters
the container, so a tampered client can only fool its own display.

A run stops at the first failing test. The response lists the passed tests with their
input, expected and actual output, plus the failed one, whose expected output is sent
only when the test is visible. It also times the student's program and the reference
solution in the same run, but the client shows that runtime only on algorithm
challenges: course lessons only have to pass. Algorithm tests mix a few hand-written cases with hidden
generated ones, all within the input limits each statement states.

### Forum

| Method | Endpoint                              | Auth  | Description                 |
| ------ | ------------------------------------- | ----- | --------------------------- |
| GET    | `/api/forum/categories`               | Yes   | List forum categories       |
| POST   | `/api/forum/categories`               | Staff | Create category             |
| PUT    | `/api/forum/categories/:slug`         | Staff | Edit category               |
| DELETE | `/api/forum/categories/:slug`         | Staff | Delete category             |
| GET    | `/api/forum/categories/:slug/threads` | Yes   | List threads in category    |
| GET    | `/api/forum/threads/:id`              | Yes   | Get thread with posts       |
| POST   | `/api/forum/threads`                  | Yes   | Create thread               |
| POST   | `/api/forum/threads/:id/posts`        | Yes   | Reply to thread             |
| DELETE | `/api/forum/threads/:id`              | Yes   | Delete thread (owner/admin) |
| POST   | `/api/forum/posts/:id/reactions`      | Yes   | Toggle reaction             |
| POST   | `/api/forum/posts/:id/solution`       | Yes   | Mark post as solution       |
| PUT    | `/api/forum/posts/:id`                | Yes   | Edit post                   |
| DELETE | `/api/forum/posts/:id`                | Yes   | Soft-delete post            |
| PUT    | `/api/forum/users/:id/role`           | Admin | Update user role            |

Reading the forum takes an account, like writing to it. "Staff" is a moderator or
an admin, with the role read from the DB.

### Terminal (Linux sandbox)

| Method | Endpoint                    | Auth  | Description                                                                                   |
| ------ | --------------------------- | ----- | --------------------------------------------------------------------------------------------- |
| POST   | `/api/terminal/session`     | Owner | Create sandboxed terminal session                                                             |
| POST   | `/api/terminal/exec`        | Owner | Execute command in session (30/min/owner)                                                     |
| POST   | `/api/terminal/check`       | Owner | Terminal judge: validate sandbox state; marks complete on pass (logged-in only), 10/min/owner |
| DELETE | `/api/terminal/session/:id` | Owner | Destroy session                                                                               |

Like the code judge, terminal routes use `optionalAuth` and key sessions by
`userId ?? guestId`, so guests can run and be judged but only logged-in users get
their completion saved.

### Support

| Method | Endpoint                            | Auth  | Description        |
| ------ | ----------------------------------- | ----- | ------------------ |
| POST   | `/api/support/tickets`              | Yes   | Create ticket      |
| GET    | `/api/support/tickets/mine`         | Yes   | Get user's tickets |
| GET    | `/api/support/tickets`              | Admin | Get all tickets    |
| PUT    | `/api/support/tickets/:id/status`   | Yes   | Update status      |
| GET    | `/api/support/tickets/:id/messages` | Yes   | Get messages       |
| POST   | `/api/support/tickets/:id/messages` | Yes   | Add reply          |

### Notifications

Gated by `requireFeatureAccess('notifications')`, launched for everyone. Requires
an identity (no guests).

| Method | Endpoint                      | Auth | Description                                                                                                                                                        |
| ------ | ----------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/api/notifications`          | Yes  | List notifications (paginated) + unread count                                                                                                                      |
| POST   | `/api/notifications/read`     | Yes  | Mark all read up to a given id                                                                                                                                     |
| POST   | `/api/notifications/:id/read` | Yes  | Mark a single notification read                                                                                                                                    |
| WS     | `/ws/user`                    | Yes  | Shared per-user socket (same gate); pushes `notification` frames (`new` / `unread-count`) and `dm` frames (`message` / `edited` / `deleted` / `read` / `reaction`) |

Notifications are emitted fire-and-forget from the forum (reply, accepted solution,
reaction), support (new ticket, reply, status change), and connection (request,
acceptance) flows; the actor is always excluded from their own notification, repeat
replies/reactions collapse into one unread row, and each user is capped at 100
retained rows. There is no DM notification type; the messages badge covers new
messages (`DM_MESSAGE` was removed from the enum with a data migration).

### Messages (DMs)

Gated by `requireFeatureAccess('messaging')`, launched for everyone. Requires an
identity (no guests).

| Method | Endpoint                               | Auth | Description                               |
| ------ | -------------------------------------- | ---- | ----------------------------------------- |
| GET    | `/api/messages/conversations`          | Yes  | Inbox: conversations + unread counts      |
| POST   | `/api/messages/conversations`          | Yes  | Open (or find) a conversation with a user |
| GET    | `/api/messages/conversations/:id`      | Yes  | Paginated message history                 |
| POST   | `/api/messages/conversations/:id`      | Yes  | Send a message                            |
| POST   | `/api/messages/conversations/:id/read` | Yes  | Mark read up to a message id              |
| PATCH  | `/api/messages/:messageId`             | Yes  | Edit own message                          |
| DELETE | `/api/messages/:messageId`             | Yes  | Soft-delete own message                   |
| POST   | `/api/messages/:messageId/reactions`   | Yes  | Toggle an emoji reaction (60/min/user)    |

Open/send/react are rate-limited per user (not per IP, since students share NAT). Live
updates ride the shared `/ws/user` socket's `dm` channel; a reaction toggle pushes
the message's full refreshed reaction list to both participants. Reactions are
stored per user+emoji (`DmReaction`, unique on message+user+emoji); the server
returns raw rows and the client groups them by emoji.

### Connections

Gated by `requireFeatureAccess('connections')`, launched for everyone. A connection is a directed
request (requester → addressee) that becomes mutual once accepted.

| Method | Endpoint                       | Auth | Description                                                  |
| ------ | ------------------------------ | ---- | ------------------------------------------------------------ |
| GET    | `/api/connections`             | Yes  | Overview: accepted + incoming + outgoing pending             |
| POST   | `/api/connections`             | Yes  | Send a request (30/min/user)                                 |
| POST   | `/api/connections/:id/accept`  | Yes  | Accept an incoming request (addressee only)                  |
| POST   | `/api/connections/:id/decline` | Yes  | Decline an incoming request (addressee only)                 |
| DELETE | `/api/connections/:id`         | Yes  | Cancel own pending request, or remove an accepted connection |

`@@unique([requesterId, addresseeId])` blocks a duplicate request in one direction;
the service checks the reverse so A→B and B→A can't coexist. The recipient gets a
`CONNECTION_REQUEST` notification and the requester a `CONNECTION_ACCEPTED` on
acceptance; responding auto-reads the request's bell entry. Client: the
`/connections` page and a sidebar entry; public profiles render a
connect/pending/connected button from the payload's `connectionRelation`.

### Profile

| Method | Endpoint                     | Auth | Description                                                          |
| ------ | ---------------------------- | ---- | -------------------------------------------------------------------- |
| PATCH  | `/api/profile`               | Yes  | Update profile (bio, status, privacy flags)                          |
| PUT    | `/api/profile/interests`     | Yes  | What the student wants to learn (`{ interests }`, at least one)      |
| PUT    | `/api/profile/code-language` | Yes  | The language picked last on a multi-language course (`{ language }`) |
| POST   | `/api/profile/avatar`        | Yes  | Upload avatar                                                        |
| DELETE | `/api/profile/avatar`        | Yes  | Remove avatar                                                        |
| POST   | `/api/profile/password`      | Yes  | Change password (10/15min)                                           |
| POST   | `/api/profile/email/request` | Yes  | Send a code to the new email (10/15min)                              |
| POST   | `/api/profile/email/confirm` | Yes  | Confirm the new email with the code (10/15min)                       |
| DELETE | `/api/profile/email/pending` | Yes  | Cancel a pending email change                                        |
| GET    | `/api/profile/activity`      | Yes  | Current streak and last active time                                  |

`PATCH /api/profile` also carries the four per-user privacy flags (`showBio`,
`showStats`, `showProgress`, `showConnections`; default on).
Profile editing and these toggles live on the `/settings` page.

### Leaderboard and public profiles

Behind the `leaderboard` gate, launched for everyone, signed-in users only (no
guests), so the service can always tell "self" from "other".

| Method | Endpoint              | Auth | Description                                                  |
| ------ | --------------------- | ---- | ------------------------------------------------------------ |
| GET    | `/api/leaderboard`    | Yes  | Ranked students by XP (`?take=` 1–100, default 50, `?skip=`) |
| GET    | `/api/leaderboard/me` | Yes  | The signed-in student's own rank                             |

| Method | Endpoint                 | Auth | Description                                        |
| ------ | ------------------------ | ---- | -------------------------------------------------- |
| GET    | `/api/users/:id/profile` | Yes  | Public profile for `/u/:userId` (from leaderboard) |

Name/avatar/member-since are always public. Bio/status, stats (lessons done,
active courses, streak), progress (level, XP, leaderboard rank, badges) and the
connections list each appear only when the target's matching privacy flag is on;
the owner viewing their own profile always sees everything. The activity heatmap
is the owner's alone: it tells on which day each lesson was done, so no one else
ever gets it and no flag shows it. The payload also carries `connectionRelation`
(`self`/`none`/`pending_outgoing`/`pending_incoming`/`connected`) for the
profile's connect button. Streak is computed by the shared
`activity.service.computeStreak` (also used by `GET /api/profile/activity`).

### Admin

Gated by `requireAdmin` (after `authenticateToken`); the role is read fresh from the DB, never from the JWT.

| Method | Endpoint                   | Auth  | Description                                                                                                                            |
| ------ | -------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/admin/stats`         | Admin | Platform stats (users/progress/forum/support, cached ~5min, + live code-exec metrics); `?fresh=1` bypasses the cache                   |
| GET    | `/api/admin/visits`        | Admin | Visitors and new accounts a day, top pages, sources, guest/signed-in, en/ro and the most pressed buttons over `?range=30` or `90` days |
| GET    | `/api/admin/visits/guests` | Admin | Guest visits with their start time and steps, newest first, 20 a page; `?range=30\|90`, `?source=`, `?before=<id>` for the next page   |

### Visits

| Method | Endpoint            | Auth     | Description                                                                                                         |
| ------ | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/visits`       | Optional | The app reports a page it showed (`{ path, referrer?, steps? }`), always a 204; bots are left out, 300/min/IP       |
| POST   | `/api/visits/steps` | Optional | A guest's clicks and scrolls on the page they're still on (`{ steps }`, 1–30), always a 204; shares the limit above |

### Tutor

Every signed-in student, behind the `tutorChat` feature key; no guests.

| Method | Endpoint                       | Auth | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------ | ------------------------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/tutor/chat`              | Yes  | One message (`{ message, page, lang?, lesson?, conversationId?, work? }`, at most 2,000 characters) in, the answer out as server-sent events (`TutorStreamEvent`: `status` lookups, `text` pieces, then `done` with `complete`/`cut`/`blocked`, or `error` after some words; a failure before any words is a plain JSON error); the model may search and read lessons first, and gets the last 20 messages of the conversation. No `conversationId` starts a new one (general, or about `lesson`: `{ courseKey, lessonSlug }` the curriculum lists); `work` is the student's code, output and verdict on that lesson. The message and the answer are saved together once it ends, and `done` names the conversation; nothing is saved when it fails before any words. 10/min/user |
| GET    | `/api/tutor/conversations`     | Yes  | The student's conversations newest first (`TutorConversationSummary`), at most 50. 60/min/user                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| GET    | `/api/tutor/conversations/:id` | Yes  | One conversation, 30 `TutorMessage`s newest first, `{ messages, hasMore }`; `?before=<id>` for older ones; someone else's is a 404                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| DELETE | `/api/tutor/conversations/:id` | Yes  | Deletes one conversation (204); the student's other conversations stay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### Usage

| Method | Endpoint                                     | Auth | Description                                                                                                                                                         |
| ------ | -------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/usage`                                 | Yes  | The student's `UsageSummary`: used, limit, remaining and refill time of Show Solution and the tutor session; admins are unlimited                                   |
| POST   | `/api/usage/solution/:courseKey/:lessonSlug` | Yes  | Reveals the lesson's reference solution (`{ lang?, language? }`) and takes one Show Solution; `{ solution, usage }`, 404 when the lesson has none, 429 at the limit |

## Database schema

Defined in [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma). Field names use camelCase in TypeScript, mapped to snake_case columns via Prisma's `@map`.

### Models

- **User**: account data (name, email, hashed password), and the code language picked last on a multi-language course
- **Curriculum**: course definitions (key, title, description, sortOrder)
- **Lesson**: lesson metadata (courseKey, slug, title, sortOrder)
- **UserLessonProgress**: per-user completion tracking
- **UserSavedCode**: per-user saved code per lesson, and per language on a multi-language course (`''` on any other)
- **DailyPick**: today's lesson or algorithm pick per user, kept so its bonus is granted once
- **LessonSubmission**: a signed-in student's judge attempts on a lesson with the language the code ran in, the newest 20 per lesson kept
- **ForumCategory / ForumThread / ForumPost / ForumReaction / ForumThreadView**: community forum (a thread's views count once per viewer)
- **SupportTicket / SupportMessage**: support system
- **Notification**: per-user in-app notifications (actor via `SetNull` relation, source entity snapshotted in `data`)
- **Conversation / DirectMessage / DmReaction**: 1-on-1 messaging (messages soft-delete; reactions unique per message+user+emoji)
- **Connection**: directed connection request (requester → addressee, `PENDING`/`ACCEPTED`)
- **PageVisit / VisitSalt / VisitTotal**: today's page views keyed by a salted daily hash, the day's salt, and the daily totals they become once the day is over
- **TutorConversation / TutorMessage**: a student's tutor conversations, each general or about one lesson or challenge, titled by its first question (the newest 50 kept), and their messages and answers, each answer with how it ended (the newest 200 per conversation kept)
- **UsageWindow**: what a student has used of each capped feature (Show Solution, the tutor session) in its current window, one row per student and feature
- **GuestVisit / VisitStep**: a guest's day on the site and what they did in it (pages, named clicks, scroll depth) in order of id; only the visit keeps a time, that of its first page; the hash goes when the day ends, the visit after 90 days

### Key relationships

```
User (1) → (N) UserLessonProgress    (ON DELETE CASCADE)
User (1) → (N) UserSavedCode         (ON DELETE CASCADE)
Curriculum.key ← Lesson.courseKey     (logical, not FK)
```

Lesson content is stored as Markdown files on disk, not in the database. The `Lesson` table stores metadata; the client reads the content from the static files generated out of `packages/content/`, and the server reads `packages/content/` itself only for the judge, Show Solution and the tutor.

## Code execution

User code runs in Docker containers, never in the browser.

| Language | Docker Image                    | Behavior                                |
| -------- | ------------------------------- | --------------------------------------- |
| Python   | `python:3.10-slim`              | Run with `-u` (unbuffered), 20s timeout |
| C        | `gcc:latest`                    | Compile with `-Wall`, 20s timeout       |
| Java     | `eclipse-temurin:21-jdk-alpine` | `javac` + run with 20s timeout          |

**One persistent container per owner.** Each owner (a logged-in user, or a guest keyed by a per-browser `guestId` cookie) gets a single long-lived container for the language they're currently running, created lazily on their first run and managed by `code-container.service.ts`. It is reused across runs (the cold start is paid once), swapped when they switch language (the previous one is torn down on the first run of the new language), garbage-collected after 15 min idle, and bounded by a global LRU cap. `interactive-execution.service.ts` writes the source into the container's `/work` tmpfs and `docker exec`s the compile/run there.

Containers are locked down with `--network=none`, `--memory=128m`, `--pids-limit=64`, `--cap-drop=ALL`, `--security-opt=no-new-privileges`, `--read-only`, and `--user=10001:10001`, a fixed unprivileged uid (`SANDBOX_UID`) that doesn't depend on the user the API runs as, so the code never runs as root even though the API does on the VPS. `/work` and `/tmp` are tmpfs mounts owned by that uid; `/work` is mounted `exec` so compiled C binaries can run under the read-only rootfs. Docker is always invoked with an argument array (no shell interpolation).

Interactive execution (`/ws/run`) uses a 20s wall-clock timeout that resets on each stdin input, plus a 1MB output cap to stop runaway output loops. On timeout, output-cap, or the page being abandoned (also while the container is still starting or the code is still compiling) the container is destroyed (reliably killing the program); on a normal exit it is kept for reuse, once `kill -9 -1` has stopped whatever the program left running in the background (Run Tests and terminal commands get the same cleanup). A sandbox's first process is a shell loop rather than `sleep infinity`, so finished processes are collected instead of piling up against the pids limit. Every sandbox is labelled `cyberstars.sandbox`, and the server removes the labelled ones when it starts, before it takes a request, since a restart that kills it mid-shutdown would otherwise leave them running untracked. A separate `/ws/presence` connection (one per tab) lets the server tear the idle container down promptly when the tab closes; the 15 min GC is the backstop. `attachRunWebSocket` routes both WS paths through one manual `noServer` upgrade handler, which first refuses (403) a handshake whose `Origin` is not in `config.allowedOrigins`, the same list CORS uses; a handshake with no `Origin` isn't from a browser and passes, the run limits cover it.

**Server-wide cap.** At most `SANDBOX_MAX_BUSY` sandboxes (four per CPU core by default) are busy at once across editor runs, Run Tests and terminal commands (`sandbox-slots.ts`); past it a run waits up to 30 s for a slot, then is told the server is busy. **While it waits the student is told** (CYB-91): an editor run hears `waiting` over its socket when it joins the line and `slot` when it gets one (`busy` when it gives up); Run Tests and terminal commands send an `X-Run-Id` of the page's own, and the page asks `GET /api/runs/:runId/waiting` every second until the answer comes or the run is past the lines (`run-waits.ts`, keyed by the owner so nobody can ask about another's run). `RunWaitNotice` shows it bottom right, above the tutor's toasts in the shared `Corner`, with a light line that changes every 5 s, and offers Try again after a busy 503; the page never sends the run again on its own. While anyone waits, an editor run that has held its slot longer than `SANDBOX_STOP_AFTER_MS` (20 s) is stopped like a timeout, the longest-held first, and its slot goes to the first in line: a run's 20 s limit starts over with every line of input, so only a run kept alive with input gets that far. Run Tests and terminal commands are never stopped; they end on their own. Run Tests also keep their own cap of two (`judge-queue.ts`), inside the shared one; both queues are `slot-queue.ts`. The admin dashboard shows the slots in use.

**Rate limits & guests.** Editor runs are capped at 10 runs / 60 s per owner (same for guests and logged-in) plus 5 concurrent; guests additionally get a lifetime budget of 10 runs (`guest-budget.service.ts`) before a sign-up nudge. Because a guest id is only a cookie a script can rotate, guest runs also share a gate per client IP (60 runs / 60 s, 10 concurrent), with the IP taken from the hop nginx appended to `X-Forwarded-For` in production. The HTTP sandbox routes follow the same rule through `guestIpLimiter` (`terminal.routes.ts`): per IP and per minute, guests share 30 terminal sessions, 180 terminal commands, 60 terminal checks and 60 Run Tests, on top of the per-owner limits; logged-in users skip it. Guests from one IP also hold at most `GUEST_IP_MAX_SANDBOXES` sandboxes at once, editor containers and terminal sessions together, busy or idle (`guest-sandboxes.ts`): a new one at the limit closes the network's least recently used idle sandbox, and is turned away only when all of them are busy. A student or guest keeps at most three terminal sessions; opening a fourth closes their oldest. The terminal exec route is capped at 30/min per user with a friendly retry-after message.

### Adding a new language

1. Create `apps/api/src/runtimes/<lang>.ts` implementing the `LanguageRuntime` interface
2. Register it in `apps/api/src/runtimes/registry.ts`

No changes to services, controllers, or routes needed.

## Lesson format

Each lesson consists of two files in `packages/content/lessons/<course>/`:

- `<slug>.md`: educational content with runnable code blocks
- `<slug>-code.md`: starter code template

A lesson may also ship an optional `<slug>-tests.json` (judge test cases) and
`<slug>-solution.md` (reference solution). Completion is **judge-driven**: the
student presses "Run Tests", the server runs their code against the cases and marks
the lesson complete only on a passing verdict; there is no manual "Mark Complete"
button. A lesson without a tests file is not completable.
Each tested lesson also keeps variants in `packages/content/variants/<course>/<slug>/`:
other correct solutions (`accept-*`) that must pass and cheats (`reject-*`) that must
fail. `npm run check:tests` grades them next to the reference solution, and the
`lesson-tests` CI workflow runs it on the lessons a pull request changes.

An algorithm challenge may also ship a **hidden part**, `<slug>-harness.md` (today every `algo-trees-graphs` challenge): the program around the function the student writes, LeetCode-style, which reads the input, builds the tree or graph and prints the answer. Its fenced block holds a `{{code: <name>}}` placeholder, and `apps/api/src/services/harness.ts` puts the student's code there both for Run Tests and for the editor's Run, which names its lesson (`lesson` in the `/ws/run` message). The student's code comes first wherever the language allows (C resets the count with `#line`), so errors name the student's own lines. The starter, the solution and the variants hold only the student's part. Hidden parts stay on the server, like solutions.

A lesson may have an optional Romanian translation at `packages/content/lessons/<course>/ro/<slug>.md` (same slug); when absent, the reader sees the English source. See [Curriculum & Lessons](#curriculum--lessons) for the fallback behavior.

A **multi-language course** (`MULTI_LANGUAGE_COURSE_KEYS`, today the `trees-graphs` course and its challenge set `algo-trees-graphs`) teaches every lesson in Python, Java and C, each in its own folder, `packages/content/lessons/<course>/<language>/` (`packages/content/algorithms/trees-graphs/<language>/` for the challenge set), with all the files above and its own `ro/`; its variants sit in `variants/<course>/<language>/<slug>/`. The student switches language on the lesson, and the lesson is ticked once whichever language passed it. The static-content generator stops the build when a lesson lacks a language, or the starter, tests, solution or hidden part its Python twin has. The language the student picked is kept in `localStorage` for a guest and in `users.code_language` for a signed-in student (`useCodeLanguage`); saved code and submissions are kept per language. Such a course is marked **Beta** (`isBeta`) and left out of what the landing page counts.

A lesson or challenge may hold **step-by-step visuals**: a ` ```visual ` fence with JSON that `MarkdownRenderer` hands to `parseVisual` (`apps/ui/src/components/visual/`). Its `type` picks the drawing: an array (the default, `ArrayView`, with pointers and markers), `boxes` (boxes and arrows, `BoxesView`), `tree` (`TreeView`), `graph` (`GraphView`), `grid` (`GridView`) or `stack` (`StackView`, a pile of cards, or a queue with `queue: true`). Each kind's frames module turns the steps into frames that `VisualPlayer`, a lazy chunk, plays one click at a time; a step may ask what comes next, with choices to pick from. A multi-language course writes each visual once, in `packages/content/lessons/<course>/visuals/<name>.json` (and `visuals/ro/`), with per-language values inside, and its lessons name it as `{"use": "<name>"}`; `packages/content/visuals.ts` puts the visual for the lesson's language into the fence when the content is generated, and `VisualSteps` keeps the student's step across a language switch. `lessonVisuals.test.ts` reads every visual in the curriculum the way a student gets it and checks that each parses and that the Romanian one tells the same story as the English.

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
