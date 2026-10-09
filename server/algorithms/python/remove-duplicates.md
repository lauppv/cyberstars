Given a list of numbers, print them **without duplicates**, preserving the original order.

### Input

- Line 1: an integer `n`, the count of numbers (1 <= n <= 200).
- Line 2: `n` integers separated by spaces, each between -1 000 000 000 and 1 000 000 000.

### Output

The numbers with duplicates removed, separated by spaces, in the order they first appeared.

### Examples

```
Input:
7
3 1 4 1 5 9 3

Output:
3 1 4 5 9
```

```
Input:
5
1 1 1 1 1

Output:
1
```

```
Input:
1
7

Output:
7
```

```
Input:
4
1 2 3 4

Output:
1 2 3 4
```

When there are no duplicates at all, the output is identical to the input.
