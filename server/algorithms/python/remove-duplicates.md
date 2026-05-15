# Remove Duplicates

Given a list of numbers, print them **without duplicates**, preserving the original order.

### Input
- Line 1: an integer `n` — the count of numbers.
- Line 2: `n` integers separated by spaces.

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

### Hints
- Use a `set` to track which numbers you've already seen.
- Loop through the list — if a number is not in the set, add it to the result and to the set.
- Sets have O(1) lookup, so checking `if x in seen` is fast.
- Join your result list with `" ".join(...)` to print it nicely.
