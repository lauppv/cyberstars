# Medium · Dynamic Array

Read an integer **N**, then read **N** integers. Store them in a **dynamically allocated** array (using `malloc`). Print the **sum** and the **average** (with 2 decimal places) of the numbers. Don't forget to `free` the memory.

This exercise practices dynamic memory allocation with `malloc` and `free`.

### Input

- First line: an integer `N` (1 ≤ N ≤ 1000)
- Second line: `N` integers separated by spaces

### Output

Two lines:

- First line: the sum (integer)
- Second line: the average (floating point, 2 decimal places)

### Examples

```
Input:
4
10 20 30 40
Output:
100
25.00
```

```
Input:
3
5 5 5
Output:
15
5.00
```

```
Input:
1
7
Output:
7
7.00
```

```
Input:
3
-5 5 10
Output:
10
3.33
```

Negative numbers work the same way — the sum can be smaller than any single
positive value, and the average still rounds to 2 decimal places.
