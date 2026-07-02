# Two Sum

Given a list of integers and a target value, find the **two indices** whose values add up to the target.

You may assume there is **exactly one** valid pair, and you cannot use the same element twice. Print the indices in ascending order.

### Input

- Line 1: `n` integers separated by spaces (the list).
- Line 2: a single integer `target`.

### Output

Two 0-based indices `i j` (with `i < j`) such that `nums[i] + nums[j] == target`.

### Examples

```
Input:
2 7 11 15
9

Output:
0 1
```

```
Input:
3 2 4
6

Output:
1 2
```

```
Input:
3 3
6

Output:
0 1
```

The same value can appear twice — as long as they are at different indices,
they still count as two separate numbers.

```
Input:
-3 4 3 90
0

Output:
0 2
```

Negative numbers work the same way: `-3 + 3 == 0`.

### Hints

- **Brute force**: try every pair with two nested `for` loops — works but is O(n^2).
- **Optimal**: use a `dict` to map each value to its index. For each number `x`, check if `target - x` is already in the dict.
- Don't forget to print the smaller index first!
- This is a classic problem that shows the power of dictionaries for fast lookups.
