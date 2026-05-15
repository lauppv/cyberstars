# Find Maximum

Given a list of numbers, find and print the **largest** one.

### Input
- Line 1: an integer `n` — the count of numbers.
- Line 2: `n` integers separated by spaces.

### Output
The largest number in the list.

### Examples

```
Input:
5
3 1 7 2 5

Output:
7
```

```
Input:
3
-10 -3 -7

Output:
-3
```

### Hints
- Use `.split()` to break the second line into a list of strings, then convert each to `int`.
- Python has a built-in `max()` function — but try solving it with a loop first!
- Start by assuming the first element is the maximum, then compare with the rest.
