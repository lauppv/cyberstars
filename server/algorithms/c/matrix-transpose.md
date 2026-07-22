Compute the **transpose** of an N×N matrix (rows become columns) and print the result.

For this exercise, the matrix is **hardcoded** directly in the code — nothing is read from stdin. Use:

```
matrix = [ [1, 2, 3],
           [4, 5, 6],
           [7, 8, 9] ]
```

### Input

None. The matrix is written directly in the code.

### Output

3 lines with 3 space-separated integers — the transposed matrix.

### Example

```
Output:
1 4 7
2 5 8
3 6 9
```

Check: the element at position `[i][j]` in the original becomes `[j][i]` in the transpose.
