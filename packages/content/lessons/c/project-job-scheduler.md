The last project puts threads to work the way servers do: a **thread pool**. Starting a new thread for every small job is slow. Instead, a few worker threads start once, and keep taking jobs from a shared queue until there's nothing left. You'll use what you built in the threads lessons: a mutex, condition variables, a bounded queue and per-job results

There is no code to copy, only a plan

---

**The parts**

- A table of jobs, filled by main from the input. Each job has a name, a number to work on, and a place for its result
- A **bounded queue** of job numbers, a ring buffer like the conveyor belt, guarded by a mutex and two condition variables
- W worker threads. Each one loops: take a job number from the queue, do the job, write the result into that job's place in the table

---

**Stopping the workers.** When main has put every job in the queue, the workers must learn that no more work is coming. A simple way is one sentinel per worker: main puts -1 in the queue W times. A worker that takes -1 stops. Since each worker takes exactly one -1, they all stop

---

**Why the results are predictable.** Which worker takes which job changes from run to run, and so does the order in which jobs finish. But each job writes only into its own place in the table, and main prints the table in order after joining all the workers. So the output is the same every time. Don't let the workers print anything

---

The job itself is to count the prime numbers from 2 up to the job's limit. Some limits are large, so several workers really help

---

## Mission: The Job Scheduler

1. Read W, the number of workers, and Q, the room in the queue. Then read jobs until the input ends: a name and a limit
2. Start W worker threads. Then put every job's number into the bounded queue, in input order, waiting while it's full. Then put W sentinels
3. Each worker takes job numbers from the queue, waiting while it's empty. For a job, it counts the primes up to the limit and saves the count in the job's table entry. For a sentinel, it stops
4. main joins all the workers, then prints each job with its count, in input order, then how many jobs there were and the total of all counts, as in the example

W is from 1 to 4 and Q from 1 to 5. Names have at most 15 characters. There are from 1 to 100 jobs, and each limit is from 1 to 50000

**Example**

Input

```text
2 2
census 100
orbit 10
payroll 1000
tiny 1
```

Output

```text
census: 25
orbit: 4
payroll: 168
tiny: 0
Jobs: 4, total: 197
```
