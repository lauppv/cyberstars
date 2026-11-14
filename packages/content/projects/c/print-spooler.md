A small office of architects shares two printers: a fast laser printer and a slow inkjet. Everyone sends their drawings at the same time, urgent drawings wait behind a report of 200 pages, and when the paper gets stuck in a printer, the job is simply lost. You will write the print spooler in C: the program between the computers and the printers. It puts the jobs in a queue in the right order, gives each one to a free printer, deals with stuck paper and cancelled jobs, and tells the office manager who printed what.

**How it works.** The program first reads the printers, then commands, and answers each command at once. Here is a session as you see it in the output box when you run a finished program. The lines you type are followed by the program's answers:

```text
1
Office 10
1 printers ready
submit ida 25 normal
Job 1: 25 pages for ida, 1 in the queue
submit dan 5 urgent
Job 2: 5 pages for dan, 2 in the queue
submit eva 5 urgent
Job 3: 5 pages for eva, 3 in the queue
tick 1
Minute 1: Office starts job 2 (dan)
Minute 1: Office finished job 2 (dan)
queue
Office: free
Job 3: eva, 5 pages, urgent
Job 1: ida, 25 pages
jam Office
Office jammed
queue
Office: jammed
Job 3: eva, 5 pages, urgent
Job 1: ida, 25 pages
fixed Office
Office works again
tick 5
Minute 2: Office starts job 3 (eva)
Minute 2: Office finished job 3 (eva)
Minute 3: Office starts job 1 (ida)
Minute 5: Office finished job 1 (ida)
report
Minutes: 6
Office: 35 pages
dan: 5 pages
eva: 5 pages
ida: 25 pages
Average time to print: 2.7 min
Still waiting: 0
quit
Spooler stopped
```

The commands:

| Command                                  | What it does                                      |
| ---------------------------------------- | ------------------------------------------------- |
| `submit <user> <pages> <normal\|urgent>` | sends a job to print                              |
| `queue`                                  | shows the printers and the jobs that wait         |
| `tick <minutes>`                         | lets some minutes go by, while the printers print |
| `cancel <job>`                           | takes a job away                                  |
| `jam <printer>`                          | the paper is stuck in a printer                   |
| `fixed <printer>`                        | the printer works again                           |
| `report`                                 | who printed how much                              |
| `quit`                                   | ends the program                                  |

Some words you will meet:

| Word        | What it means                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------- |
| job         | one thing to print: who sent it and how many pages                                                  |
| queue       | the jobs that wait, in the order they will print                                                    |
| jam         | paper stuck in a printer: it stops until it is fixed                                                |
| linked list | a list where each item points to the next one, made with `malloc`, so it can grow as much as needed |

**To try your program**, press Run, then type or paste the lines in the output box. `quit` ends the program.

Build the program one step at a time, in one C file. Each step adds a command or a rule, and the commands from earlier steps keep working. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests play other days at the office. Passing them finishes the project.

## The printers

The program first reads the printers: how many there are (at most 10), then each one's name and how many pages it prints in a minute:

```text
2
Laser 20
Inkjet 5
```

Print `2 printers ready`. Then read commands until someone types `quit`, and print `Spooler stopped` then. Read each command word with `scanf("%s", cmd)`, and use `strcmp` to see which one it is. For any other word, print `Unknown command: print` and skip the rest of its line.

## Submit a job

`submit <user> <pages> <normal|urgent>` sends a job to the spooler. Jobs are numbered from 1:

```text
submit ida 30 normal
Job 1: 30 pages for ida, 1 in the queue
```

Nobody knows how many jobs will come, so don't put them in an array of fixed size. Make each job a struct with `malloc`, and keep the queue as a **linked list**: each job points to the next one with a `struct Job *next`. A pointer to the first job is the whole queue.

## The order of the queue

Urgent jobs go before normal ones. Of two jobs of the same kind, the one sent first goes first. Put each new job straight into its place in the list, instead of sorting later.

`queue` shows each printer, then the jobs that wait, in the order they will print:

```text
queue
Laser: free
Inkjet: free
Job 3: julia, 12 pages, urgent
Job 1: ida, 30 pages
Job 2: dan, 8 pages
Job 4: leo, 50 pages
```

When no job waits, the last line is `Queue empty`.

To find where a job goes in the list, use a pointer to a pointer, `struct Job **p = &queue`. Then the same code puts a job at the start, in the middle, or at the end.

## Printing

`tick <minutes>` lets time go by, one minute at a time. Every minute, each printer, in the order they were listed:

1. if it is free and a job waits, takes the first job out of the queue
2. prints as many pages of its job as it can in one minute (fewer if the job has fewer pages left)
3. if the job is done, gives it out and frees its memory

Say when a printer starts a job and when it finishes one:

```text
tick 2
Minute 1: Laser starts job 3 (julia)
Minute 1: Laser finished job 3 (julia)
Minute 1: Inkjet starts job 1 (ida)
Minute 2: Laser starts job 2 (dan)
Minute 2: Laser finished job 2 (dan)
```

`queue` now also shows how far a busy printer is: `Inkjet: job 1, 10 of 30 pages`.

## Cancel

`cancel <job>` takes a job away, wherever it is:

- if it still waits in the queue, it comes out of the list: `Job 4 cancelled`
- if a printer is printing it, the printer stops and is free: `Job 4 cancelled after 20 of 50 pages`
- in any other case (finished, cancelled before, never sent): `No job 4`

Either way, give its memory back with `free`. To take a job out of the middle of a linked list, make the job before it point to the job after it.

## Paper jams

`jam <printer>` says the paper is stuck in a printer. The printer stops. If it was printing a job, the job goes back to the queue and will print again from page 1. It goes **before** the other jobs of its kind, because it was there first:

```text
jam Inkjet
Inkjet jammed, job 1 goes back to the queue
```

A printer with no job prints only `Office jammed`.

A jammed printer takes no jobs, and `queue` shows it as `Inkjet: jammed`. `fixed <printer>` makes it work again: `Inkjet works again`. For a name that is not a printer, print `No printer Plotter`.

## The office report

`report` shows:

- the minutes so far
- how many pages each printer printed
- how many pages each user printed, sorted by name
- the average time from sending a job to its last page, for the jobs that finished, with one digit after the point
- how many jobs still wait

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

Every page that came out counts, so the 10 pages of Ida's job that the jam spoiled count too: that paper is used. Before any job has finished, print `Average time to print: none`.

## Clean up

A spooler runs for months, so it must never lose memory. Before the program ends, `free` every job still in the queue and every job still in a printer.

It must also deal with wrong input:

- a `submit` without a user, a whole number of at least 1 pages, and `normal` or `urgent`: print `Usage: submit <user> <pages> <normal|urgent>` and skip the rest of the line
- a `tick` without a whole number of at least 1: print `Usage: tick <minutes>`
- a `cancel` without a whole number: print `Usage: cancel <job>`
- when the input ends, stop as if `quit` had been typed
