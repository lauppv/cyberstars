# Speed baseline

How fast CyberStars answers, alone and under load, measured on 2026-10-31 on
main at b13b7322, after the faster judge (#349). [README.md](README.md) says
how to start the box and run the test again.

## In short

- **Alone, everything is quick.** API answers are under 0.1 s and pages under
  0.2 s, Run under 0.4 s in Python and C and 1.6 s in Java, Run Tests
  0.5–2.6 s, Java's up to 9.5 s on 20 cases.
- **Under load, the one core is the limit, then memory.** Run Tests waits
  for the CPU, not for its own work: on production, five bots running code
  without pause kept the vCPU at 79% on average with three processes waiting
  for it, and pushed 90 MB into swap.
- **Since #349**, those five bots' Run Tests take a median 32 s in Java instead
  of 53 s, and 7 s in Python instead of 25 s, and the judge turned one away in
  32 instead of seven in 26.
- **Locally, 18 users running code without pause got no error.** Times start
  to climb from 12; at 18, Run Tests takes about twice as long as alone, C's
  up to eight times in one of the two runs, and some runs wait for one of the
  four sandboxes.
- **No candidate is worth a ticket now**, with at most three students expected
  at once. When that grows, memory is the first thing to run out on the
  droplet, then Java's Run Tests is the first place to win time back.

## How it was measured

**Locally**, in the box: one core, 1 GB of memory and 2 GB of swap, like the
droplet, with every limit at the code's default. Each path ran alone, one
user for four minutes:

```bash
bash loadtest/box.sh up
bash loadtest/run.sh alone-runjava -u 1 -r 1 -t 4m RunJava   # and so on, one user type at a time
```

Then Run and Run Tests in all three languages ran together in steps of 6, 12
and 18 users, 90 s each, twice, each time after `box.sh up`:

```bash
STEP=1 STEP_USERS=6 STEP_SECONDS=90 MAX_USERS=18 bash loadtest/run.sh steps-code-1 \
  RunPython RunJava RunC TestsPython TestsJava TestsC
```

**On production**, only the five bot accounts, for five minutes, each opening a
random lesson, pressing Run, then Run Tests with the solution, 4–20 s apart:
once on 2026-10-30, before #349, and once on 2026-10-31 at 09:48 UTC, after
it, with two students and no guests online. The droplet's CPU and memory were
read every second (`vmstat`). Nothing else touched production, so the visitor
pages and the forum have local numbers only.

Times are from the request to the last byte of the answer, in milliseconds
unless they say otherwise; a page is from its first request to its last
answer. Alone, a path ran 1 to 50 times, so its p99 is its slowest run.

## Alone

| Path                              |  p50 |  p95 | slowest |
| --------------------------------- | ---: | ---: | ------: |
| Landing page, first visit         |   25 |   50 |      50 |
| Lesson page, first visit          |   34 |   44 |      44 |
| Student opens the app             |  170 |      |     170 |
| Student opens a lesson in the app |   27 |   65 |      65 |
| Forum: categories                 |   12 |   16 |      16 |
| Forum: a category's threads       |    7 |   10 |      10 |
| Leaderboard                       |   12 |   26 |      26 |
| Run, Python                       |  280 |  320 |     323 |
| Run, Java                         | 1600 | 1700 |    1670 |
| Run, C                            |  380 |  410 |     415 |
| Run Tests, Python, 1 case         |  560 |  740 |     745 |
| Run Tests, Python, 50 cases       | 1400 | 2600 |    2580 |
| Run Tests, Java, 1 case           | 1800 | 6100 |    6087 |
| Run Tests, Java, 20 cases         | 6400 | 9500 |    9523 |
| Run Tests, C, 1 case              |  540 |  910 |     910 |
| Run Tests, C, 49 cases            |  660 |  830 |     825 |

The box's CPU stayed under 12% on average for every path, at most 66% for a
moment; memory held by programs stayed under 280 MB and nothing went to swap.

**Where Run Tests' time goes.** Each Run Tests first waits for one of the
judge's two slots (none alone), then runs in the student's warm container:
it starts the runner, compiles where the language needs it, and runs the
student's program on each case. The reference output of a case is cached
after the first run, so only the student's program runs again. From the
lesson with one case and the one with many, about:

| Language | Start and compile | Each case |
| -------- | ----------------: | --------: |
| Python   |             0.5 s |     17 ms |
| Java     |             1.6 s |    240 ms |
| C        |             0.5 s |      3 ms |

Java's slowest runs, 6.1 s and 9.5 s, were each lesson's first: the
container's first Java start and the reference solution run on every case.

**Starting a container** costs little: a student's first Run took 0.42 s in
Python against 0.28 s after, 1.72 s in Java against 1.6 s, 0.54 s in C
against 0.38 s.

## Under load

Run and Run Tests in all three languages at once, one user type each, so
every user runs code every 5–15 s (Run) or 10–30 s (Run Tests) and never
stops to read: harder than the same number of students. Users came in steps
of 6, 12 and 18, 90 s each, and the first 20 s of a step are left out. The
test ran twice, each time on a fresh box; the table has the median of each
run, first and second.

| Users                          |           6 |          12 |           18 |
| ------------------------------ | ----------: | ----------: | -----------: |
| Run, Python                    |   420 / 480 |   560 / 490 |    490 / 960 |
| Run, Java                      | 1700 / 1800 | 2000 / 2200 |  2600 / 4000 |
| Run, C                         |   630 / 580 |  620 / 1200 |   880 / 1200 |
| Run Tests, Python, 50 cases    | 2500 / 1700 | 2400 / 1800 |  2400 / 2900 |
| Run Tests, Java, 20 cases      | 6500 / 6600 | 7200 / 8300 | 9400 / 12000 |
| Run Tests, C, 49 cases         |   940 / 960 | 1700 / 3000 |  1800 / 5600 |
| Runs that waited for a sandbox |       0 / 0 |       0 / 7 |       8 / 13 |
| The box's CPU, average         |   37% / 34% |   55% / 55% |    72% / 80% |
| Swap in use, most              |    1 / 1 MB |   8 / 17 MB |   29 / 64 MB |

Neither run had an error, in 438 and 443 requests. A run that waited for a
sandbox (at most four run at once on one core) waited 0.4–3 s. The judge's
own line, two Run Tests at a time, never reached its 20 s.

**How far the two runs agree.** They did the same amount of work, 438 and 443
requests, and with 6 users Run agrees within 6–14%. With 12 and 18 users a
path had only 2 to 20 runs in a step, too few for its median to hold still:
the second run's C Run Tests took three times the first's. The few percent
the ticket asks for need longer steps, five minutes or more; that run is
still to do.

**The box is not the droplet.** At 18 users the box's CPU was where the
droplet's was with five bots, around 80%, yet the droplet took far longer:
its vCPU most likely does less in a second than this laptop's core, and the
bots start a new container on most runs. So local numbers compare with local numbers,
before and after a change, and production's stand on their own.

## On production

Five bots for five minutes, before and after #349:

| Path, seconds     | p50, 10-30 | p95, 10-30 | p50, 10-31 | p95, 10-31 | errors, 10-30 → 10-31 |
| ----------------- | ---------: | ---------: | ---------: | ---------: | --------------------- |
| Open a lesson     |        0.3 |        0.6 |        0.3 |        0.6 | 0/28 → 0/33           |
| Run, Python       |        2.4 |        4.2 |        2.1 |        5.7 | 0/10 → 0/15           |
| Run, Java         |        8.3 |       10.4 |        8.2 |       10.1 | 0/10 → 0/10           |
| Run, C            |        3.1 |        3.6 |        3.5 |        6.1 | 0/6 → 0/7             |
| Run Tests, Python |       25.4 |       43.0 |        7.1 |       24.9 | 3/10 → 1/15           |
| Run Tests, Java   |       53.4 |       59.2 |       32.3 |       52.7 | 3/10 → 0/10           |
| Run Tests, C      |        3.5 |       12.3 |        3.9 |       12.5 | 1/6 → 1/7             |

On 10-31 the droplet's CPU averaged 79%, at 100% for stretches, with 3.1
processes waiting for it on average; free memory fell to 60 MB, swap grew to
232 MB, and 90 MB was swapped out over the five minutes. The errors were the
judge's 503 after 20 s in line, but for one on 10-31: the bots' copy of the
first lesson still had its solution from before #348, which no longer passes.

The bots are harder than students: each runs code every 4–20 s without
stopping to read, and opens lessons in all three languages at random, so most
of their runs start a new container, while a student stays in one language.
Five bots are more than five students, and for now no more than three
students are expected at once.

## Candidates

The candidates from the Speed project's overview, and one this baseline
added. None is a ticket now: each says when it would become one.

- **Run Tests in Java.** The slowest path: alone, 1.8 s for one case and
  6.4 s for 20, about 0.24 s a case, down from 0.5–0.8 s before #349. It holds
  one of the judge's two slots that long, and it is what took 32 s with five
  bots on production. **Not now**; it is the first place to win time back
  when more students run code at once.
- **The first Run in a language.** Starting the container costs 0.1–0.2 s:
  0.42 s against 0.28 s in Python, 1.72 s against 1.6 s in Java, 0.54 s
  against 0.38 s in C. **Dropped.**
- **The judge's queue of two.** No Run Tests waited out its 20 s locally, up
  to 18 users; on production one did in 32 with five bots, down from seven
  in 26. On one core, more slots would split the same CPU between more runs,
  and each would end later. **Dropped**; the queue does what it is for.
- **Slow database queries.** Every API answer took under 75 ms alone, and
  opening a lesson took 0.3 s on production with the bots, the same before and
  after #349. The local database is nearly empty, though, and production's
  grows with every student. **Dropped for now**; measure again when
  production has a few thousand accounts.
- **Memory on the droplet (new).** With five bots, free memory fell to 60 MB
  and 90 MB went to swap in five minutes; locally, programs held up to 445 MB
  at 18 users and swap started to grow from 12. A code container may take up
  to 128 MB, a Java one 256 MB. **Not now**; it is the first thing to run
  out when more students run code at once, and a 2 GB droplet is the
  cheapest answer then.
