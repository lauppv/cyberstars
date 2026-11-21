FCFS, SJF and Round Robin side by side, each written as a function you can call on the same processes

---

## Mission: The Scheduler Contest

The operations manager must choose a scheduler for the new mainframe. You get a batch of real jobs and run the three algorithms on it, to compare their average waiting times

1. Read n and a quantum q, then n lines with a name, an arrival time and a burst time
2. Write three functions, **fcfs**, **sjf** and **round_robin**, each one returning the total waiting time of all the processes under that algorithm. Use the same rules as in the lessons: ties go to the earlier arrival, then to the input order, and in Round Robin new arrivals join the queue before the stopped process
3. Print the average waiting time of each, with two decimals, then the name of the best one, the one with the lowest average. When two are equal, the one printed first wins

n is from 1 to 20 and q from 1 to 10. Names have at most 7 characters. Arrival times are from 0 to 100, and bursts from 1 to 50

**Example**

Input

```text
4 2
P1 0 7
P2 1 4
P3 2 1
P4 3 4
```

Output

```text
FCFS: 6.00
SJF: 5.25
RR: 6.25
Best: SJF
```
