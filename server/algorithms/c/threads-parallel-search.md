Split an array in two and search for a `target` in parallel with two threads. The threads write to a shared global `found_index` protected by a **mutex**: whenever a thread finds a match, it updates the value only if the new index is smaller than the one already recorded.

At the end, the main thread prints the smallest index where `target` appears, or `Not found` if it doesn't appear anywhere.

### Input

- First line: integer `N` (2 ≤ N ≤ 100)
- The next `N` lines: one integer per line (each between -1000 and 1000)
- Last line: integer `target`

### Output

- A single line: `Found at index K` where K is the smallest index (0-based) where `target` appears, or `Not found` if `target` doesn't appear at all.

### Examples

```
Input:
6
10
20
30
40
50
60
30
Output:
Found at index 2
```

```
Input:
5
1
2
3
4
5
7
Output:
Not found
```

```
Input:
6
7
3
7
8
7
9
7
Output:
Found at index 0
```

Even if `target` appears more than once, we always print the smallest index — that's why we compare `i < found_index` under the mutex.

Use **pthread_create**, **pthread_join** and a shared **pthread_mutex_t**.
