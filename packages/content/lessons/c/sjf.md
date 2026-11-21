FCFS made short jobs wait behind long ones. **SJF**, "shortest job first", fixes that: whenever the processor is free, it picks, among the processes that have already arrived, the one with the **shortest burst**. That one runs to the end, then the scheduler picks again

```text
name  arrival  burst
P1       0       7
P2       1       4
P3       2       1
P4       3       4
```

At 0, only P1 is there, so it runs from 0 to 7. At 7, P2, P3 and P4 are all waiting. P3 is the shortest, so it runs from 7 to 8. Then P2 and P4 both need 4: when bursts are equal, the one that arrived first goes first, so P2 runs from 8 to 12, then P4 from 12 to 16

```text
0-7 P1
7-8 P3
8-12 P2
12-16 P4
```

With FCFS, the average waiting here would be 6.00. With SJF it's 5.25

---

It can be proved that SJF gives the **smallest possible average waiting time** of all the algorithms that let a process run to the end once it starts. Short jobs leave quickly, so fewer processes are waiting at any moment

But it has two problems

1. A real scheduler doesn't know how long a process will run. Real systems **guess**, from how long the process ran last time
2. A long process can wait forever if short ones keep arriving. That's called **starvation**

---

The simulation needs a loop that picks the next process each time. Mark the processes that are done. When nothing has arrived yet, the processor is idle until the next arrival

```c
#include <stdio.h>

int main(void) {
    int n = 4;
    int arrival[] = { 0, 1, 2, 3 };
    int burst[] = { 7, 4, 1, 4 };
    int done[] = { 1, 0, 0, 0 };
    int clock = 7;

    int pick = -1;
    for (int i = 0; i < n; i++) {
        if (done[i] || arrival[i] > clock) {
            continue;
        }
        if (pick == -1 || burst[i] < burst[pick] ||
            (burst[i] == burst[pick] && arrival[i] < arrival[pick])) {
            pick = i;
        }
    }
    printf("at %d: P%d\n", clock, pick + 1);
    return 0;
}
```

Output

```text
at 7: P3
```

Walking i from 0 up and replacing pick only when the new one is strictly better also keeps the input order for full ties

---

## Mission: Shortest Job First

Simulate SJF, the version where a process runs to the end once it starts

1. Read n, then n lines with a name, an arrival time and a burst time
2. Each time the processor is free, choose among the processes that have arrived and are not done: the shortest burst, then the earliest arrival, then the one that came first in the input. If none has arrived, the processor is idle until the next one arrives
3. Print the timeline, then each process's waiting and turnaround times in the order of the input, then the two averages with two decimals, in the same format as the FCFS lesson

n is from 1 to 20. Names have at most 7 characters. Arrival times are from 0 to 100, and bursts from 1 to 50

**Example**

Input

```text
4
P1 0 7
P2 1 4
P3 2 1
P4 3 4
```

Output

```text
0-7 P1
7-8 P3
8-12 P2
12-16 P4
P1: waiting 0, turnaround 7
P2: waiting 7, turnaround 11
P3: waiting 5, turnaround 6
P4: waiting 9, turnaround 13
Average waiting: 5.25
Average turnaround: 9.25
```
