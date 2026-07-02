# Medium · Insertion Sort

Read a list of numbers and sort them using the **insertion sort** algorithm. Insertion sort works by building a sorted portion of the list one element at a time: pick the next unsorted element and insert it into the correct position in the sorted portion.

### Input

- Line 1: an integer `n` — the count of numbers.
- Line 2: `n` integers separated by spaces.

### Output

The sorted numbers, separated by spaces.

### Examples

```
Input:
5
5 3 8 1 2

Output:
1 2 3 5 8
```

```
Input:
4
4 3 2 1

Output:
1 2 3 4
```

```
Input:
1
9

Output:
9
```

A single-element list is already sorted.

```
Input:
4
3 1 3 1

Output:
1 1 3 3
```

Duplicate values are kept — the sort just needs to place equal values next to
each other.

### Hints

- Start from the second element (index 1). Compare it with elements to its left and shift larger elements one position to the right.
- Use a `while` loop inside the `for` loop to find the correct insertion position.
- The outer loop runs from index 1 to n-1; the inner loop moves leftward while the current element is smaller.
- Do **not** use Python's built-in `sort()` or `sorted()` — implement the algorithm yourself!
