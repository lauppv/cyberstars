# Sum of a List

Given a count `N` followed by `N` numbers (one per line), print their **sum**.

### Input
- The first line contains an integer `N`.
- The next `N` lines each contain one integer.

### Output
Print the sum of the `N` numbers.

### Examples

```
Input:
3
10
20
30
Output: 60
```

```
Input:
4
1
2
3
4
Output: 10
```

### Hints
- Use a `for` loop with `range(n)` to read each number.
- Keep a running total by adding each number to an accumulator variable.
- You can also collect numbers into a list and use the built-in `sum()` function.
