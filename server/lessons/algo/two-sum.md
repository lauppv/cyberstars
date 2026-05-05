# Two Sum

Given an array of integers and a target value, find the **indices** of the two numbers that add up to the target.

You may assume there is **exactly one** valid pair, and you cannot use the same element twice. Print the indices in **ascending order**, separated by a space.

### Input
- Line 1: integers separated by spaces (the array).
- Line 2: a single integer `target`.

### Output
Two indices `i j` (0-based, `i < j`) such that `nums[i] + nums[j] == target`.

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

### Hints
- Brute force: two nested loops over indices — O(n²).
- Optimal: walk the array once, keep a `dict` from `value -> index`. For each new number `x` at index `i`, check whether `target - x` is already in the dict.
- Don't forget to print the smaller index first.
