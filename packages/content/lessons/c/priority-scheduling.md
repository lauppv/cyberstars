Not all processes are equally important. Moving the mouse pointer matters more than a backup running in the night. **Priority scheduling** gives each process a priority number, and the processor always goes to the most important ready process. In our exercises, as in Linux, a **smaller number means more important**: priority 1 beats priority 5

---

We'll simulate the preemptive version: the scheduler looks again **at every unit of time**. If a more important process arrives while a less important one runs, the running one is stopped right away, and continues later from where it was

```text
name  arrival  burst  priority
P1       0       4       3
P2       1       2       1
P3       2       2       2
```

```text
0-1 P1
1-3 P2
3-5 P3
5-8 P1
```

P1 starts alone. At 1, P2 arrives with priority 1, more important than P1's 3, so P2 takes over and runs to the end at 3. Now P3, priority 2, beats P1. P1 finally finishes from 5 to 8

---

Simulating it one unit at a time is the easiest way

```text
for (int t = 0; finished < n; t++) {
    int pick = -1;
    // among the arrived, unfinished processes, find the smallest priority
    // run pick for one unit: left[pick]--
}
```

For the timeline, we don't print every single unit. We remember who ran in the last unit, and when someone else runs, or the processor goes idle, we print the piece that just ended

---

Priority scheduling has the same danger as SJF: **starvation**. If important processes keep coming, an unimportant one may never run. Real systems fix that with **aging**: the longer a process waits, the more important it becomes, until it finally gets its turn

---

## Mission: Priorities

Simulate preemptive priority scheduling

1. Read n, then n lines with a name, an arrival time, a burst time and a priority
2. At every unit of time, run the process that has arrived, isn't done, and has the smallest priority number. When priorities are equal, the earlier arrival wins, then the one that came first in the input. If none is ready, the processor is idle
3. Print the timeline with each piece merged, as in the example, then each process's waiting and turnaround times in the order of the input, and the two averages with two decimals

n is from 1 to 20. Names have at most 7 characters. Arrival times are from 0 to 100, bursts from 1 to 50 and priorities from 1 to 10

**Example**

Input

```text
3
P1 0 4 3
P2 1 2 1
P3 2 2 2
```

Output

```text
0-1 P1
1-3 P2
3-5 P3
5-8 P1
P1: waiting 4, turnaround 8
P2: waiting 0, turnaround 2
P3: waiting 1, turnaround 3
Average waiting: 1.67
Average turnaround: 4.33
```
