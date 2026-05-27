# Easy · Find the Minimum

Read an integer **N**, then read **N** integers. Print the **smallest** value.

This exercise practices tracking a running minimum while reading input.

### Input

- First line: an integer `N` (1 ≤ N ≤ 100)
- Second line: `N` integers separated by spaces

### Output

A single integer: the minimum value among the `N` numbers.

### Examples

```
Input:
5
3 1 4 1 5
Output: 1
```

```
Input:
3
10 20 30
Output: 10
```

### Hints

- Read the first number and set it as your initial `min`.
- Loop through the remaining numbers; if a number is less than `min`, update `min`.
- You can also store everything in an array first and then scan it — either approach works.
