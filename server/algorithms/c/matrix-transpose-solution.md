```c
#include <stdio.h>

int main(void) {
    int mat[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    int n = 3;

    // Transpose: the element at [i][j] becomes [j][i].
    // We print mat[j][i] at result position (i, j).
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("%d", mat[j][i]);
            if (j < n - 1) {
                printf(" ");
            }
        }
        printf("\n");
    }

    return 0;
}
```
