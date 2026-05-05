# Sort the Numbers

You're given a list of integers separated by spaces. Sort them in **ascending** order and print them on a single line, separated by spaces.

The sorting algorithm is up to you — bubble sort, selection sort, or even Python's built-in `sorted()`. The point is to practice list manipulation.

### Input
A single line with integers separated by spaces.

### Output
The same numbers in ascending order, space-separated, on one line.

### Examples

```
Input:  5 3 1 4 2
Output: 1 2 3 4 5
```

```
Input:  10 -1 7
Output: -1 7 10
```

### Hints
- `input().split()` gives you a list of strings — convert with `[int(x) for x in ...]`.
- `sorted(nums)` returns a sorted copy.
- Print with `" ".join(str(x) for x in nums)`.
