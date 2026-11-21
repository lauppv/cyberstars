Locking in order prevents deadlocks between mutexes. But an operating system hands out many kinds of resources: tape drives, printers, memory. Some systems take a careful approach: before giving a process what it asks for, they check that the system could still finish **every** process afterwards. If not, the process waits, even though the resources are free. The classic method for that check is the **banker's algorithm**, named after a banker who never lends money in a way that could leave him unable to pay everyone back

---

The system keeps a few tables. With n processes and m kinds of resources

- **Available**: how many of each kind are free right now
- **Max**: the most of each kind that each process may ever need. Every process says this when it starts
- **Allocation**: how many of each kind each process holds now
- **Need** = Max - Allocation: how many more each process may still ask for

A state is **safe** if there is an order in which every process can get all it still needs, finish, and give everything back

---

The safety check plays that out

1. Work starts as a copy of Available. No process is finished yet
2. Find a process that isn't finished and whose Need fits in Work, for every kind of resource
3. Pretend it runs to the end: it gives back what it holds, so Work grows by its Allocation. Mark it finished
4. Go back to step 2. If every process finishes, the state is safe, and the order we found is a **safe sequence**. If we get stuck with some unfinished, it's unsafe

A small example with one kind of resource, 2 free

```text
         Max  Allocation  Need
P0        5       3         2
P1        4       2         2
```

Work is 2. P0 needs 2: it fits. P0 finishes and gives back 3, so Work is 5. Now P1 needs 2: it fits too. Safe sequence: P0 P1

---

When a process asks for resources, the system checks three things

1. Is the request more than the process's Need? Then it's an **error**: the process broke its promise
2. Is it more than Available? Then the process must **wait**: there isn't enough right now
3. Otherwise, pretend to give it: Available goes down, the process's Allocation goes up and its Need goes down. Run the safety check. If the new state is safe, the request is **granted** and stays. If not, undo everything, and the process waits

A state can be unsafe without being a deadlock yet. Unsafe only means that a deadlock **could** happen if the processes ask for the worst. The banker never takes that chance

---

## Mission: The Banker

The computing center hands out its resources with the banker's algorithm. Check the starting state, then answer a list of requests, one after another

1. Read n and m. Then Available, m numbers. Then Max, n rows of m numbers. Then Allocation, n rows of m numbers. Work out Need
2. Run the safety check. When several processes could go next, always choose the one with the smallest number, and after every finished process, start looking again from P0. Print `Safe:` and the sequence, or `Unsafe`
3. Then read requests until the input ends: a process number and m numbers. Answer each one with one line, as in the example: `granted`, `wait`, `unsafe` or `error`. A granted request changes the tables for the next ones. One that is not granted changes nothing

n is from 1 to 8, m from 1 to 4, and every number from 0 to 20. If the starting state is unsafe, there are no requests

**Example**

Input

```text
5 3
3 3 2
7 5 3
3 2 2
9 0 2
2 2 2
4 3 3
0 1 0
2 0 0
3 0 2
2 1 1
0 0 2
1 1 0 2
4 3 3 0
0 0 2 0
1 0 3 0
```

Output

```text
Safe: P1 P3 P0 P2 P4
P1 1 0 2: granted
P4 3 3 0: wait
P0 0 2 0: unsafe
P1 0 3 0: error
```

After the first request is granted, Available is 2 3 0. P4 asks for 3 of the first kind, but only 2 are free. P0's request fits, but afterwards no process could finish. P1 now needs only 0 2 0, so asking for 3 of the second kind breaks its promise
