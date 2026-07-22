Multiply two matrices **A** and **B** and print the resulting matrix **C**.

Matrix multiplication is defined as: `C[i][j] = sum of A[i][k] * B[k][j]` for all k. The number of columns in A must equal the number of rows in B.

For this exercise, matrices A and B are **hardcoded** directly in the code — nothing is read from stdin. Use:

```
A = [ [1, 2, 3],
      [4, 5, 6] ]

B = [ [7,  8],
      [9,  10],
      [11, 12] ]
```

### Input

None. The matrices are written directly in the code.

### Output

- 2 lines, each containing 2 space-separated integers — the product matrix C.

### Example

```
Output:
58 64
139 154
```

Check on paper: `C[0][0] = 1*7 + 2*9 + 3*11 = 58`, `C[0][1] = 1*8 + 2*10 + 3*12 = 64`, etc.
