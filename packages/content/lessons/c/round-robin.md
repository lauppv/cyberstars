FCFS and SJF let a process run to the end. On a computer that people use, that's a problem: while one long job runs, nothing else moves, and the screen freezes. Real systems use **preemption**: the scheduler can stop a process in the middle and give the processor to someone else

The simplest preemptive algorithm is **Round Robin**. Every process gets a small slice of time, called the **quantum**. When its slice is over and it's not done, it goes to the back of the queue, and the next one gets a turn. Everybody moves a little, all the time

---

With a quantum of 2

```text
name  arrival  burst
P1       0       5
P2       1       3
P3       2       1
```

```text
0-2 P1
2-4 P2
4-5 P3
5-7 P1
7-8 P2
8-9 P1
```

At 0 only P1 is there: it runs 2. While it ran, P2 and P3 arrived, so they are in the queue first, and P1 goes behind them, with 3 left. P2 runs 2, and goes to the back with 1 left. P3 needs only 1: it finishes before its slice is over, and the next one starts right away. Then P1, P2, P1 again

---

The details that decide the order

- The ready queue is first in, first out. We can keep it as an array with a front and a back
- When a slice ends, first add every process that arrived **up to that moment**, then put the stopped process at the back
- A process that finishes leaves the queue for good
- If the queue is empty, the processor is idle until the next arrival

---

The quantum is a balance. Very large, and Round Robin becomes FCFS. Very small, and the processor spends a lot of its time switching between processes instead of working: each switch, a **context switch**, has a cost. Real systems use a few milliseconds

Round Robin's average waiting time is usually worse than SJF's. What it gives instead is a quick first answer for everyone, and no starvation: every process gets a turn

---

## Mission: Round Robin

Simulate Round Robin

1. Read n and the quantum q, then n lines with a name, an arrival time and a burst time
2. Put the processes in the queue in order of arrival, the input order breaking ties. Run the front one for q units, or less if it needs less. When a slice ends, first add the processes that arrived up to that moment, then put the stopped process at the back if it's not done
3. Print every slice on its own line, even when the same process runs twice in a row, and `idle` when the queue is empty
4. Then print each process's waiting and turnaround times in the order of the input, and the two averages with two decimals, as in the SJF lesson

n is from 1 to 20 and q from 1 to 10. Names have at most 7 characters. Arrival times are from 0 to 100, and bursts from 1 to 50

**Example**

Input

```text
3 2
P1 0 5
P2 1 3
P3 2 1
```

Output

```text
0-2 P1
2-4 P2
4-5 P3
5-7 P1
7-8 P2
8-9 P1
P1: waiting 4, turnaround 9
P2: waiting 4, turnaround 7
P3: waiting 2, turnaround 3
Average waiting: 3.33
Average turnaround: 6.33
```
