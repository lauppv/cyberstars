```c
#include <stdio.h>

void matrix_stats(int matrix[3][3], int *sum, int *min, int *max) {
    *sum = 0;
    *min = matrix[0][0];
    *max = matrix[0][0];
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            *sum = *sum + matrix[i][j];
            if (matrix[i][j] < *min) *min = matrix[i][j];
            if (matrix[i][j] > *max) *max = matrix[i][j];
        }
    }
}

int main(void) {
    int matrix[3][3];
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            scanf("%d", &matrix[i][j]);
        }
    }

    int sum, min, max;
    matrix_stats(matrix, &sum, &min, &max);

    printf("Sum: %d\n", sum);
    printf("Min: %d\n", min);
    printf("Max: %d\n", max);

    return 0;
}
```
