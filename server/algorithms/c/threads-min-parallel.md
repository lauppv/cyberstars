# Medium · Parallel Minimum with Threads

Split an array in two and search for the minimum in parallel: thread t1 works on the first half, thread t2 on the second. Each thread receives **a pointer** to a slot where it writes its result, and the main thread compares the two minima at the end.

Threads take a single `void *` argument, so we pack the start, the stop, the array and the result slot into a struct. Each thread writes to its own slot, so no mutex is needed.

### Input

- First line: integer `N` (2 ≤ N ≤ 100)
- The next `N` lines: one integer per line (each between -1000 and 1000)

### Output

- A single line: `Min: X` where X is the smallest value in the array.

### Examples

```
Input:
6
5
3
8
1
7
4
Output:
Min: 1
```

```
Input:
4
-2
-7
-5
-1
Output:
Min: -7
```

Use **pthread_create** and **pthread_join** from `pthread.h`.
