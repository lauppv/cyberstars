A computer with one processor core can run only one process at a moment. When several processes are ready, the operating system has to choose which one runs next. That part of the kernel is the **scheduler**, and the rule it uses is a **scheduling algorithm**. The next lessons are about the classic ones. We won't change a real kernel: we'll **simulate** them, like the exercises in an operating systems class

---

Each process in these exercises has

- a name, like P1
- an **arrival** time: when it becomes ready to run
- a **burst** time: how long it needs the processor

And for each one we measure

- **turnaround**: from arrival to finish. How long it took, waiting included
- **waiting**: how long it was ready but didn't run. That's turnaround minus burst

A good algorithm keeps the average waiting time low

---

The simplest algorithm is **FCFS**, "first come, first served". Processes run in the order they arrive, each one to the end, like a queue at a counter. If the processor is free and nobody has arrived yet, it waits: we call that time **idle**

```text
name  arrival  burst
P1       0       5
P2       1       3
P3       2       1
```

P1 arrives first and runs from 0 to 5. P2 arrived at 1, runs from 5 to 8. P3 runs from 8 to 9. We draw it as a timeline, called a **Gantt chart**

```text
0-5 P1
5-8 P2
8-9 P3
```

P3 needed only 1 unit but waited 6. That's FCFS's weak spot, the **convoy effect**: short jobs stuck behind a long one, like cars behind a slow truck

---

To work out the times, keep a clock. For each process in arrival order: if the clock is earlier than its arrival, the processor is idle until then. The process starts at the clock, finishes at clock + burst, and the clock moves to its finish

```c
#include <stdio.h>

int main(void) {
    int n = 3;
    int arrival[] = { 0, 1, 2 };
    int burst[] = { 5, 3, 1 };

    int clock = 0;
    for (int i = 0; i < n; i++) {
        if (clock < arrival[i]) {
            clock = arrival[i];
        }
        int start = clock;
        clock = clock + burst[i];
        int finish = clock;
        printf("%d-%d P%d\n", start, finish, i + 1);
    }
    return 0;
}
```

Output

```text
0-5 P1
5-8 P2
8-9 P3
```

To print averages with two decimals, divide as doubles and use **%.2f**

---

## Mission: First Come, First Served

The batch room runs jobs strictly in the order they arrive. Simulate it

1. Read n, then n lines with a name, an arrival time and a burst time
2. Order the processes by arrival time. When two arrive at the same time, keep their order from the input
3. Run them with FCFS. Print the timeline, one line per piece of time, with `idle` where the processor waits
4. Then, in the order of the input, print each process's waiting and turnaround time, and at the end the two averages with two decimals, as in the example

n is from 1 to 20. Names have at most 7 characters. Arrival times are from 0 to 100, and bursts from 1 to 50

**Example**

Input

```text
3
P1 0 5
P2 1 3
P3 7 1
```

Output

```text
0-5 P1
5-8 P2
8-9 P3
P1: waiting 0, turnaround 5
P2: waiting 4, turnaround 7
P3: waiting 1, turnaround 2
Average waiting: 1.67
Average turnaround: 4.67
```

**Example**

Input

```text
2
A 3 2
B 0 1
```

Output

```text
0-1 B
1-3 idle
3-5 A
A: waiting 0, turnaround 2
B: waiting 0, turnaround 1
Average waiting: 0.00
Average turnaround: 1.50
```
