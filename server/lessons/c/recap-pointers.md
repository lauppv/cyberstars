Combine **nested loops**, **pointers**, and **pass by reference**

---

Build a **matrix statistics** calculator. You have a 3x3 matrix (a 2D array). Write functions that use **pointers** to return results:

**void matrixStats(int matrix[3][3], int \*sum, int \*min, int \*max)**

This function uses **nested loops** to go through the matrix and sets the sum, min, and max values through pointers

Then in main, use this matrix:
```c
#include <stdio.h>

int main(void) {
    int matrix[3][3] = {
        {5, 12, 3},
        {8, 1, 15},
        {7, 9, 4}
    };
    return 0;
}
```

Call matrixStats and print the results

Expected output
```text
Sum: 64
Min: 1
Max: 15
```

The function "returns" three values at once using pointers — the pattern we learned in the pointers-functions lesson
