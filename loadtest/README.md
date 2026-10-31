# Load test

How fast CyberStars answers, alone and under load, measured on a copy of
production that runs on this machine. The numbers and what they mean are in
[report.md](report.md).

It needs Linux with cgroup v2 and Docker on the systemd cgroup driver (run.sh
reads the box's CPU and memory from its cgroup), the repo's dependencies
(`npm ci`) and Playwright's Chromium (`npx playwright install chromium`).

## The box

Production is a droplet with one vCPU, 1 GB of memory and 2 GB of swap, where
the app, PostgreSQL and every code container share that one vCPU. The box
(`box.yml`) is the same on this machine: a Docker daemon of its own, held to
one core, 1 GB and 2 GB of swap, running the repo's `docker-compose.yml`
inside it. The app is built the way production builds it (the bundled UI and
the pre-rendered pages), and every limit, queue and sandbox setting keeps the
code's default, as on production.

```bash
bash loadtest/box.sh up     # build this checkout, start the box, fresh database
bash loadtest/box.sh down   # stop it, keep the images it holds
bash loadtest/box.sh wipe   # stop it and drop its images too
```

The first `up` copies about 4 GB of images into the box; later ones only the
app, when it changed. Each `up` starts on a fresh database, so two runs of the
test start from the same place, and writes down what a browser asks for on
each page (`capture.mjs`, `results/pages.json`): the built files' names change
with every build.

The box runs on core 11 (`BOX_CPU`), one of this laptop's efficiency cores,
which has no second thread sharing it; the test itself runs on cores 0–7. The
app answers on port 8080 (`BOX_PORT`).

## The test

```bash
bash loadtest/run.sh <name> [locust options] [user types]

bash loadtest/run.sh alone-run-java -u 1 -t 3m RunJava
bash loadtest/run.sh mixed -u 20 -r 1 -t 10m
STEP=1 STEP_USERS=2 STEP_SECONDS=60 MAX_USERS=20 bash loadtest/run.sh steps-tests-java TestsJava
```

Locust runs in Docker (`locust.Dockerfile`), so nothing is installed on this
machine. With no user types it mixes them all by their weights; `STEP=1` adds
users in steps (`step.py`) to find where the box stops keeping up.

| User type                            | What it does                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `Visitor`                            | A first visit, nothing cached: the landing page or a pre-rendered lesson page, every file  |
| `Student`                            | Signs up, opens the app, then opens lessons from inside it, reading each for 20–60 s       |
| `Community`                          | The forum's categories, a category's threads, a thread; the leaderboard and their own rank |
| `RunPython`, `RunJava`, `RunC`       | Run over `/ws/run` on the `for` lesson, the lesson page open so the container stays warm   |
| `TestsPython`, `TestsJava`, `TestsC` | Run Tests with the solution, on a lesson with one case and on one with many (50, 20, 49)   |

Each simulated user comes from its own address, sent as `X-Forwarded-For`,
which the app reads in production mode as it does behind nginx. Real students
come from their own addresses too, so the limits that count per address hold
for each of them as they do on production, and none is raised for the test.

A page is recorded twice: each request under its path, and the whole page as
one `PAGE` entry, from the first request to the last answer, with six requests
at a time as a browser sends them. A run is recorded until the program exits,
and again until its first output; a student's first run is apart (`(first)`),
since it pays for starting the container.

## Results

`loadtest/results/` (not in git) gets, for each run: `<name>_stats.csv` (per
path), `_stats_history.csv` (every second), `_failures.csv`, `<name>.html`,
and `<name>_box.csv`: each second, the box's CPU as a percent of its one core,
and its memory (`anon` is what the programs hold, `file` the page cache the
kernel gives back when it needs to) and swap in MB.
