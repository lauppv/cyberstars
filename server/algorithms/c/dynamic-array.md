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

### Hints

- Allocate with `int *arr = (int *)malloc(n * sizeof(int));`
- Compute the sum in a loop, then divide by `n` (cast to `double`) for the average.
- Use `printf("%.2f\n", avg)` for 2 decimal places.
- Always `free(arr)` at the end.
