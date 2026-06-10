Combine **nested loops**, **pointers**, and **pass by reference**

---

## Mission: Sensor Grid Analysis

The station's 3x3 sensor grid just finished a radiation sweep. Tommy needs a quick diagnostic: the total reading, the lowest value, and the highest spike. One function must return all three results at once through pointers.

The data is already on the right. Do the following, in order:

1. Write **void matrix_stats(int matrix[3][3], int *sum, int *min, int \*max)** using nested loops to scan the matrix
2. Set the sum, min, and max values through pointers
3. Call the function from main and print the results

**Output**

```text
Sum: 64
Min: 1
Max: 15
```

The function "returns" three values at once using pointers — the pass-by-reference pattern
