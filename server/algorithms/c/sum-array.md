# Easy · Sum of Array

Read an integer **N**, then read **N** integers. Print their **sum**.

This exercise practices reading values with `scanf` in a loop and accumulating a total.

### Input

- First line: an integer `N` (1 ≤ N ≤ 100)
- Second line: `N` integers separated by spaces

### Output

A single integer: the sum of all `N` numbers.

### Examples

```
Input:
5
1 2 3 4 5
Output: 15
```

```
Input:
3
10 -3 7
Output: 14
```

### Hints

- Initialize a `sum` variable to `0` before the loop.
- Use `scanf("%d", &x)` inside a `for` loop to read each number.
- Add each number to `sum` as you read it — you don't even need an array!
