# Medium · Sum in Halves with Fork

Split an array into two halves and parallelise the addition: the child sums the first half, the parent sums the second. The child sends its partial sum through a pipe, then the parent adds the two parts and prints the total.

When `N` is odd, the first half has `N/2` elements and the second has `N - N/2` — a split that comes out cleanly with no awkward remainders.

### Input

- First line: integer `N` (1 ≤ N ≤ 100)
- The next `N` lines: one integer per line (each between -1000 and 1000)

### Output

- A single line: `Sum: X` where X is the sum of all N numbers.

### Examples

```
Input:
4
10
20
30
40
Output:
Sum: 100
```

```
Input:
5
1
2
3
4
5
Output:
Sum: 15
```

In the first example, the child computes `10 + 20 = 30`, the parent computes `30 + 40 = 70`, and the total is 100.

Use **pipe()**, **fork()** and **wait(NULL)**.
