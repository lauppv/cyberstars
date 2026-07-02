# Medium · Fibonacci

Print the first N Fibonacci numbers. The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13, ...

### Input

- A single integer `n` (1 <= n <= 30).

### Output

The first `n` Fibonacci numbers, separated by spaces.

### Examples

```
Input:
5

Output:
0 1 1 2 3
```

```
Input:
8

Output:
0 1 1 2 3 5 8 13
```

```
Input:
1

Output:
0
```

With `n = 1` you only print the very first term — no space, no second number.

```
Input:
2

Output:
0 1
```

### Hints

- Start with two variables: `a = 0` and `b = 1`.
- In each step, print `a`, then update: `a, b = b, a + b`.
- Python supports tuple assignment, which makes the swap elegant.
- Be careful with the edge case `n = 1` — just print `0`.
