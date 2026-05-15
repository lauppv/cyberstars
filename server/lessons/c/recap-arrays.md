Combine **arrays**, **looping over arrays**, **break/continue**, and **functions**

---

You're building a **grade analyzer** for a class of students. Write these functions:

**int countPassing(int grades[], int n)** — returns how many grades are **>= 50** (passing). Use **continue** to skip grades below 50

**int findMax(int grades[], int n)** — returns the highest grade. Use a loop with an array

**int findFirstFail(int grades[], int n)** — returns the **first** failing grade (below 50). Use **break** to stop as soon as you find one. Return **-1** if everyone passed

Use this array in main:
```c
int grades[] = {85, 42, 91, 67, 38, 73, 95, 55};
```

Expected output
```text
Passing: 6
Highest: 95
First fail: 42
```
