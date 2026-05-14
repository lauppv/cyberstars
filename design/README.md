# Handoff: CyberStars — Interactive Coding Education Platform

## Overview
A free interactive coding education platform where kids and teens (target audience: complete beginners) learn **Python, C, and Java** through structured lessons. Each lesson features educational content on the left and a **live code editor** on the right. Heavy gamification (XP, streaks, badges, achievements, leaderboard) keeps young learners engaged. Logged-in users get progress tracking and code persistence across sessions.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, **not production code to copy directly**. The task is to **recreate these designs in the target codebase's existing environment** (React, Next.js, Vue, etc.) using its established patterns and libraries — or, if no environment exists yet, to choose the most appropriate framework (Next.js + TypeScript recommended) and implement them there.

The code execution in the prototype is **simulated** (regex-matched on `print()` calls). Production needs a real backend that runs Python/C/Java code in a sandboxed environment (e.g., Pyodide for Python in-browser, or a containerized backend like Judge0).

## Fidelity
**High-fidelity (hifi)**: Pixel-perfect mockups with final colors, typography, spacing, and interactions. The developer should recreate the UI pixel-perfectly using the codebase's existing libraries and patterns.

---

## Screens

The platform has five main screens, navigable in this flow:

```
Auth (Login/Signup)  →  Dashboard  →  Courses  →  Lesson View
                             →  Challenges
```

### 1. Auth Page (`CyberStars Auth.html`)

**Purpose**: Sign users in or let them create a new account.

**Layout**: Split layout, full viewport height
- **Left panel** (flex: 1): Branding with logo, tagline, feature list, animated "code rain" background
- **Right panel** (460px fixed width): Tabbed form (Login ↔ Sign Up)

**Components**:
- **Auth tabs**: Segmented control toggle inside a `--bg3` rounded container (radius `--radius`, padding 4px). Active tab uses `--accent` background with white text and shadow `0 2px 8px #6C5CE744`.
- **Form fields**: Email + Password, plus "Display Name" on signup. Inputs have:
  - Padding `11px 14px`, border 1px `--border`, radius `--radius-sm`, background `--bg`
  - On focus: border `--accent` + box-shadow `0 0 0 3px var(--accent-glow)`
- **Password visibility toggle**: 👁️ / 🙈 emoji as right-side icon, click to reveal.
- **Password strength meter** (signup only): 3 horizontal bars (weak=red / medium=yellow / strong=green), updates as user types.
- **Submit button**: Full-width, accent bg, shows spinner during loading.
- **Login extras**: "Remember me" checkbox + "Forgot password?" link in flex row.
- **Footer link**: "Don't have an account? Sign up free" / "Already have an account? Log in" — toggles tab.
- **Success state** (after signup): 🚀 icon + "Welcome to CyberStars!" + "Go to Dashboard →" button.

**Background animation** (left panel decoration):
- **Canvas starfield** — warp-drive effect with stars streaming radially outward from center
- ~220 stars at varied colors (white, lavender, amber, blue tones)
- Motion-blur trails for streaking effect; glow halos on near stars; subtle twinkle
- SPEED constant `0.007` (per-frame z-decrement) — slow & contemplative
- Deep space gradient background (`#1a0d3d` → `#0a0518` → `#000`) with pulsing accent glow behind brand content

**Auth flow**:
- Login → loading spinner (1.5s) → redirect to `Dashboard.html`
- Signup → loading spinner → success screen → "Go to Dashboard →"

**Responsive**: Below 900px, brand panel hides; form panel goes full-width.

---

### 2. Dashboard (`CyberStars Dashboard.html`)

**Purpose**: User's home base after login. Shows progress at a glance and surfaces "what to do next" without forcing them into a course catalog.

**Design rationale**: For kids/teens with heavy gamification, the dashboard is **NOT** a course-selection screen. It's a motivational home base that:
1. Validates progress (welcome + stats above the fold)
2. Lowers friction to continue (big "Continue Learning" card with last lesson)
3. Shows social proof (leaderboard) and history (activity feed)

**Layout**: Top-down vertical scroll, max-width 1040px, centered.

**Sections** (in order):
1. **Topbar** (sticky, 56px): Logo + nav (Dashboard / Courses / Challenges) + streak pill + user avatar button
2. **Welcome hero**: Greeting + "Welcome back, Alex" + 3 stat cards (Total XP / Day Streak / Level) on a gradient bg with radial glow accent
3. **XP mini-bar**: Compact "Level 4 — 120 / 300 XP to next" with thin gradient progress bar (max-width 260px)
4. **Continue Learning**: One large clickable card with:
   - Course icon (52px rounded square, course-color tinted bg)
   - Course badge pill + lesson title + description
   - Right side: progress %, mini progress bar, "Continue →" button (accent)
   - Click anywhere → navigates to lesson view
5. **Your Courses**: 3-column grid of course cards (Python / Java / C)
   - Each card: icon (44px) + name + lesson count, description, footer with progress bar OR "Start Course →" button if 0%
   - Hover: lifts 2px with shadow, accent border
6. **Bottom row**: 2-column grid:
   - **Recent Activity**: Color-coded dots + activity text + relative time
   - **Leaderboard**: Top 5 ranked users with rank #, avatar, name, XP. Current user row highlighted with accent tint border.

**Onboarding Tour** (first-visit only):
- Modal overlay covering the dashboard
- 5 steps: Welcome → Choose Your Path → Code as You Learn → Earn XP & Badges → Never Get Stuck
- Each step: emoji icon (48px), title, body text, dot indicator showing position
- "Skip" + "Next →" / "Get Started!" actions
- Persisted via `localStorage.cyberstars_toured = '1'`

---

### 3. Courses (`CyberStars Courses.html`)

**Purpose**: Catalog page where users browse all available courses and preview syllabuses before enrolling.

**Layout**: Top-down, max-width 1040px
1. Topbar (same as Dashboard)
2. Page header: "Courses" + subtitle
3. **Filter chips row**: pill-shaped buttons — All / Python / Java / C / Beginner / Intermediate / Advanced. Active chip uses accent background.
4. **Course grid** (2 columns): Each card has:
   - Top color banner strip (6px, course brand color)
   - Icon (48px rounded, tinted bg) + name + level tag (color-coded: beginner=green, intermediate=amber, advanced=red)
   - Description (2-3 lines)
   - Stats row: lesson count, hours estimated, total XP
   - Footer: progress bar + "Continue" button (if started) OR "View Syllabus →" button (if not)
5. Card hover: lifts 2px, accent border, shadow

**Syllabus Drawer** (slides in from right when clicking a card):
- 440px wide, full-height
- Header: course icon + name + meta (lessons / hours / XP) + close button
- Description block
- **Chapters list**: Numbered circles (or green ✓ if done) + chapter name + detail + XP reward per chapter
- Footer: full-width "Start Course →" / "Continue Learning →" button (navigates to Lesson View)
- Click outside drawer or × closes it
- Animation: overlay fades in (200ms), drawer slides in from right (300ms cubic-bezier)

**Course count**: 6 courses (2 per language) — Python Fundamentals/Intermediate, Java Basics/OOP, C Programming/Systems

---

### 4. Challenges (`CyberStars Challenges.html`)

**Purpose**: LeetCode-style coding challenges by difficulty + category. Users solve problems and earn XP.

**Layout**: Full viewport, three-section horizontal split
1. **Topbar** (same as Dashboard, "Challenges" nav active)
2. **Challenge list sidebar** (360px wide, left):
   - Title "Challenges"
   - **Category chips**: All / Arrays / Strings / Loops (small pill chips)
   - **Difficulty chips**: All / Easy / Medium / Hard (color-coded: green/amber/red)
   - **List of challenges**: Each item has:
     - Status circle (E/M/H letter for difficulty, green ✓ if solved)
     - Name + category tag
     - "+XP" badge (or "Solved" if completed)
   - Active challenge highlighted with accent bg + border
3. **Main pane** (flex: 1, right):
   - **Problem header**: difficulty pill + name + "+XP" badge
   - **Split pane** (50/50):
     - **Left**: Problem description with sections — Description (with bold/code formatting), Examples (input/output blocks in monospace), Constraints (bulleted list)
     - **Right**: Code editor panel
       - Toolbar: language badge + ✨ Hint + ▶ Run + Submit (green, primary)
       - Editor with syntax highlighting (same as Lesson View)
       - Bottom result panel with tabs: Output / Test Results
       - Test Results show each test case with ✓/✗ icons

**Submit Flow**:
- Click Submit → 1.5s "Testing..." spinner
- Test results appear (random pass/fail simulation)
- If all pass: **Success modal** pops up — 🏆 + "Challenge Solved!" + "+XP earned" + "Next Challenge →" button

**Challenge data**: 10 sample challenges — Two Sum, Reverse String, FizzBuzz, Palindrome Check, Max Subarray Sum, Valid Parentheses, Count Words, Matrix Spiral, Bubble Sort, Flatten Nested List. Difficulties: easy/medium/hard. Categories: arrays/strings/loops. Each has description, examples with explanations, constraints, starter code, test cases.

---

### 5. Lesson View (`CyberStars Lesson View v2.html`)

**Purpose**: The core learning experience — read lesson content and write/run code side-by-side.

**Layout**: Full-viewport column flex
- **Top bar** (52px): logo, breadcrumb, streak widget, user avatar (clickable → opens profile)
- **XP bar row** (compact, 25% width inline-left, NOT full-width)
- **Main area** (flex row):
  - **Sidebar** (240px, collapsible): lesson section nav with completion markers + sidebar progress bar (no badges — those moved to profile)
  - **Content split**:
    - **Left**: Lesson markdown content (section badge, title, body, tip box, prev/next buttons)
    - **Right**: Code editor panel (46% width, max 560px)

**Code Editor**:
- Toolbar with language badge (colored dot + name) + ✨ Hint button + ▶ Run button (green)
- Editor body: line numbers column (40px) + textarea overlaid on `<pre>` for syntax highlighting
- Syntax highlighting via simple regex (keywords/strings/numbers/comments) — replace with Monaco or CodeMirror in production
- AI Hint bar slides up below editor with simulated CyberBot tips
- Output panel at bottom shows execution result

**Profile Modal** (click user avatar):
- Modal overlay (520px wide)
- Header: 64px avatar + name + join date + close button
- 3-column stat grid: Total XP / Day Streak / Badges count
- XP bar with current level
- **Courses section**: List of enrolled courses with progress bars
- **Badges section**: 8-badge grid (`auto-fill, minmax(100px, 1fr)`) — earned (accent border + glow) vs. locked (40% opacity, grayscale)

**Section completion**: Running code in a section marks it complete (green ✓ in sidebar, +15 XP, achievement toast). Final "Practice Challenge" awards +50 XP.

**Lesson content**: 5-section Python lesson on Variables & Data Types — full markdown body with code blocks, tables, tip boxes.

---

## Design Tokens

### Colors (Dark Theme)
| Token | Value | Usage |
|---|---|---|
| `--accent` | `#6C5CE7` | Primary accent (purple), buttons, active states |
| `--accent-glow` | `#6C5CE733` | Glows, focus rings, soft backgrounds |
| `--bg` | `#0F0F14` | Page background |
| `--bg2` | `#16161D` | Topbar, sidebar, panel backgrounds |
| `--bg3` | `#1E1E28` | Nested surfaces, tracks, toolbar |
| `--surface` | `#22222E` | Cards, badges |
| `--surface2` | `#2A2A38` | Hover states, inline code bg |
| `--border` | `#2E2E3E` | All borders |
| `--text` | `#E8E8F0` | Primary text |
| `--text2` | `#9999B0` | Secondary text, body copy |
| `--text3` | `#666680` | Muted text, labels, disabled |
| `--success` | `#00D68F` | Run button, completion, output text |
| `--warning` | `#FFAA00` | XP level badge, streak |
| `--error` | `#FF6B6B` | Errors, weak password |

### Colors (Light Theme — lesson view only, via Tweaks)
| Token | Value |
|---|---|
| `--bg` | `#F5F5FA` |
| `--bg2` | `#EDEDF4` |
| `--bg3` | `#E2E2EE` |
| `--surface` | `#FFFFFF` |
| `--text` | `#1A1A2E` |
| `--text2` | `#6666A0` |

### Code Editor (Dark)
| Element | Color |
|---|---|
| Editor background | `#0D1117` |
| Output bg | `#0A0E14` |
| Line numbers | `#444D60` |
| Keywords | `#FF79C6` |
| Strings | `#F1FA8C` |
| Numbers | `#BD93F9` |
| Comments | `#6272A4` (italic) |

### Course Brand Colors
| Course | Color |
|---|---|
| Python | `#3572A5` |
| Java | `#b07219` |
| C | `#555555` |

### Typography
| Role | Font | Size | Weight | Notes |
|---|---|---|---|---|
| UI / Body | Space Grotesk | 13–15px | 400–600 | — |
| Headlines | Space Grotesk | 22–32px | 700 | letter-spacing: -0.5px |
| Section labels | Space Grotesk | 11px | 600 | uppercase, letter-spacing: 1px |
| Code | JetBrains Mono | 12–13px | 400–500 | line-height 1.65, tab-size 4 |

### Spacing & Radius
| Token | Value |
|---|---|
| `--radius` | `10px` |
| `--radius-sm` | `6px` |
| Modal radius | `14–16px` |
| Sidebar width | `240px` |
| Editor panel | `46%`, max `560px` |
| Topbar height | `52px` (lesson) / `56px` (dashboard) |
| Dashboard max-width | `1040px` |
| Auth form panel | `460px` fixed |

### Shadows
- Card hover: `0 4px 20px #0004` or `0 6px 20px #0004`
- Achievement toast: `0 8px 32px #0008, 0 0 24px var(--accent-glow)`
- Earned badge glow: `0 0 12px var(--accent-glow)`
- Submit button hover: `0 4px 16px #6C5CE744`
- Active tab: `0 2px 8px #6C5CE744`

---

## Interactions & Behavior

### Auth
- Tab switch: instant, no animation
- Submit: 1.5s simulated loading → redirect (login) or success screen (signup)
- Password strength: live re-compute on input (length checks + uppercase + numbers)

### Dashboard
- Onboarding tour: shown once per browser via localStorage
- Continue card click: → lesson view
- Course card hover: lift 2px + accent border + box shadow

### Lesson View
- Run button: 800–1400ms simulated execution → output appears
- First run per section: marks complete + awards XP + shows achievement toast (slides up from bottom-right, auto-dismisses 3s)
- AI Hint: 1.2s loading dot pulse → contextual hint appears
- Section navigation: editor remounts (loses any unsaved code in that section)
- Profile modal: click avatar → fade-in overlay (200ms) + modal scale-up (300ms cubic-bezier)
- Sidebar toggle: hides/shows 240px sidebar

### Animations
| Animation | Duration | Easing |
|---|---|---|
| `slideUp` (hint bar) | 0.3s | ease |
| `fadeIn` (overlay) | 0.2s | ease |
| `modalIn` (profile/tour) | 0.3s | cubic-bezier(.22,1,.36,1) |
| `rain` (auth code rain) | 18–25s | linear, infinite |
| Toast slide | 0.4s | cubic-bezier(.22,1,.36,1) |
| XP bar fill | 0.6s | cubic-bezier(.22,1,.36,1) |
| Spinner | 0.6s | linear, infinite |

---

## State Management

### Global / Persistent
- `cyberstars_toured` (localStorage): bool, has user seen the onboarding tour
- User session (auth token, profile)
- Per-user: XP, streak, completed sections, code drafts per lesson, badges earned

### Per-Page
| Page | State | Purpose |
|---|---|---|
| Auth | mode | 'login' / 'signup' / 'success' |
| Auth | email, password, name, showPw, remember, loading | Form |
| Dashboard | showTour, activeNav | UI |
| Lesson View | currentSection, completedSections, xp, streak, showToast, sidebarOpen, showProfile | Progress + UI |
| Code Editor | code, output, running, showAIHint, aiHint, aiLoading | Per-editor |

---

## Production Recommendations

1. **Code execution**: Use **Pyodide** for in-browser Python (no backend needed), or **Judge0 / Piston API** for a containerized backend that supports Python, Java, and C.
2. **Code editor**: Replace the regex-highlighter with **Monaco Editor** (VS Code's editor) or **CodeMirror 6** for production-grade syntax highlighting, autocomplete, and error squiggles.
3. **Auth**: NextAuth.js / Clerk / Supabase Auth — email + password only per requirements.
4. **AI Hints**: Wire the ✨ Hint button to an actual LLM endpoint passing the current code + lesson context.
5. **Persistence**: Save code drafts on every keystroke (debounced) so users never lose work between sessions.
6. **Markdown**: Replace the simple regex renderer with `react-markdown` + `rehype-highlight` for full markdown + code-block support.
7. **Animations**: The CSS-only animations are fine; reach for Framer Motion if you need orchestrated gestures.
8. **Icons**: Replace ALL emoji with proper SVG icons (Lucide, Phosphor, or custom set) for production. Emoji are placeholders only.

## Assets
- **Fonts**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (both Google Fonts)
- **Icons**: All emoji-based (placeholders for production):
  - `⬡` logo, `🔥` streak, `⭐` level, `🐍` Python, `☕` Java, `⚙️` C
  - `🐍🧠⚡🌟🏆💎🚀🔥` badges, `🏆` challenge, `💡` tip, `🤖` AI, `🚀` user avatar
  - `🦊🐺🦉🐱` leaderboard avatars
- No image/video assets — all UI built from CSS + emoji.

## Files in This Bundle
| File | Purpose |
|---|---|
| `CyberStars Auth.html` | Auth page (login/signup) with starfield background |
| `CyberStars Dashboard.html` | Dashboard with welcome, courses, leaderboard, onboarding tour |
| `CyberStars Courses.html` | Course catalog with syllabus drawer |
| `CyberStars Challenges.html` | Challenges with split editor view |
| `CyberStars Lesson View v2.html` | Lesson view with profile modal |
| `app-v2.jsx` / `components.jsx` / `tweaks-panel.jsx` | Lesson View support files |

All pages navigate to each other via the topbar (Dashboard / Courses / Challenges). Start with `CyberStars Auth.html` to walk the full flow.
