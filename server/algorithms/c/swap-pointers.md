# Medium · Swap with Pointers

Read two integers. Write a function `swap` that takes two **int pointers** and swaps their values. Call it from `main`, then print the swapped values.

This exercise practices passing by reference in C using pointers and the dereference operator `*`.

### Input

Two integers on a single line, separated by a space.

### Output

The two integers swapped, space-separated, on one line.

### Examples

```
Input:  3 7
Output: 7 3
```

```
Input:  10 10
Output: 10 10
```

### Hints

- Your `swap` function signature should be `void swap(int *a, int *b)`.
- Use a temporary variable inside `swap` to hold `*a` before overwriting it.
- Call it with `swap(&x, &y)` from `main`.
