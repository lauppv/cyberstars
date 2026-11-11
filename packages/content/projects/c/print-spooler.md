The office of a small architecture firm shares two printers: a fast laser and a slow inkjet. Everyone sends their drawings at the same time, urgent jobs get stuck behind a 200-page report, and when a printer jams its job simply vanishes. You'll write the print spooler, the program between the computers and the printers: it queues the jobs in the right order, hands them to whichever printer is free, survives jams and cancellations, and tells the office manager who printed what.

You build it one step at a time, in one C file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests run office days your program has never seen. Passing them finishes the project.

The program reads everything with `scanf` and writes everything with `printf`. Commands are words: `scanf("%s", cmd)` reads the next one, and `strcmp` tells which it is. Run it, then type the lines of an example yourself to see what it answers.

## The printers

The program starts by reading the printers: how many (at most 10), then each one's name and how many pages it prints a minute:

```text
2
Laser 20
Inkjet 5
```

Print `2 printers ready`, then keep reading commands until someone types `quit`, and print `Spooler stopped` then. Any other word prints `Unknown command: print` and skips the rest of its line.

## Submit a job

`submit <user> <pages> <normal|urgent>` sends a job to the spooler. Jobs are numbered from 1:

```text
submit ida 30 normal
Job 1: 30 pages for ida, 1 in the queue
```

Nobody knows how many jobs will come, so don't put them in a fixed array: make each job a struct with `malloc`, and keep the queue as a **linked list**, each job pointing to the next one with a `struct Job *next`. A pointer to the first job is the whole queue.

## The order of the queue

Urgent jobs go before normal ones; among jobs of the same kind, the one submitted first goes first. Insert each new job at its place in the list, rather than sorting later. `queue` shows each printer, then the jobs waiting in the order they'll print:

```text
queue
Laser: free
Inkjet: free
Job 3: julia, 12 pages, urgent
Job 1: ida, 30 pages
Job 2: dan, 8 pages
Job 4: leo, 50 pages
```

With nothing waiting, the last line is `Queue empty`. Walking a list to find where a job goes is easiest with a pointer to a pointer, `struct Job **p = &queue`, so the same code inserts at the front, in the middle or at the end.

## Printing

`tick <minutes>` lets time pass, a minute at a time. Every minute, each printer in the order they were listed:

1. if it's free and a job is waiting, takes the first job off the queue
2. prints as many pages of its job as it can in a minute (fewer if the job has fewer left)
3. if the job is done, hands it out and frees its memory

Say when a printer starts and finishes a job:

```text
tick 2
Minute 1: Laser starts job 3 (julia)
Minute 1: Laser finished job 3 (julia)
Minute 1: Inkjet starts job 1 (ida)
Minute 2: Laser starts job 2 (dan)
Minute 2: Laser finished job 2 (dan)
```

`queue` now shows how far a busy printer is: `Inkjet: job 1, 10 of 30 pages`.

## Cancel

`cancel <job>` takes a job away, wherever it is:

- still in the queue, it comes out of the list: `Job 4 cancelled`
- being printed, the printer stops and is free: `Job 4 cancelled after 20 of 50 pages`
- anywhere else (finished, cancelled, never submitted): `No job 4`

Either way its memory goes back with `free`. Taking a job out of the middle of a linked list means pointing the job before it at the job after it.

## Paper jams

`jam <printer>` says a printer jammed: it stops printing, and its job, if it had one, goes back to the queue to be printed again from page 1, **before** the other jobs of its kind, since it was first:

```text
jam Inkjet
Inkjet jammed, job 1 goes back to the queue
```

A jammed printer takes no jobs; `queue` shows it as `Inkjet: jammed`. `fixed <printer>` brings it back: `Inkjet works again`. An unknown name prints `No printer Plotter`.

## The office report

`report` shows the minutes so far, the pages each printer printed, the pages each user printed (sorted by name), the average time from submitting a job to its last page among jobs finished, and how many jobs still wait:

```text
report
Minutes: 7
Laser: 76 pages
Inkjet: 14 pages
dan: 8 pages
ida: 40 pages
julia: 12 pages
leo: 20 pages
mara: 6 pages
sara: 4 pages
Average time to print: 1.8 min
Still waiting: 0
```

Every page that came out counts, so Ida's 10 pages lost in the jam count too: that paper is gone. Before any job finished, the average reads `Average time to print: none`.

## Clean up

A spooler runs for months, so it must never lose memory. Before the program ends, `free` every job still in the queue and every job still on a printer. And it must survive bad input:

- `submit` without a user, a whole number of pages of at least 1 and `normal` or `urgent` prints `Usage: submit <user> <pages> <normal|urgent>` and skips the rest of the line
- `tick` and `cancel` whose number isn't a whole number print `Usage: tick <minutes>` (at least 1) or `Usage: cancel <job>`
- when the input ends, stop as if `quit` had been typed
