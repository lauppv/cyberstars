A parent and a child split the work: the child counts the even numbers, the parent counts the odd ones. The child sends its result to the parent through a pipe, and the parent prints both counts.

We send an `int` through the pipe with **write(p[1], &evens, sizeof(int))** and read it on the other end with **read(p[0], &evens, sizeof(int))** — pipes carry raw bytes, not just text.

### Input

- First line: integer `N` (1 ≤ N ≤ 100)
- The next `N` lines: one integer per line (each between -1000 and 1000)

### Output

- Line 1: `Evens: X` where X is the count of even values.
- Line 2: `Odds: Y` where Y is the count of odd values.

### Examples

```
Input:
6
1
2
3
4
5
6
Output:
Evens: 3
Odds: 3
```

```
Input:
4
2
4
6
8
Output:
Evens: 4
Odds: 0
```

Zero counts as even (0 % 2 == 0). Negative numbers work the same way: -4 is even, -3 is odd.

Use **pipe()**, **fork()** and **wait(NULL)**.
