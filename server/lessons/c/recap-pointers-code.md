#include <stdio.h>

void matrixStats(int matrix[3][3], int *sum, int *min, int *max) {
    // nested loops + pointer writes
}

int main(void) {
    int matrix[3][3] = {
        {5, 12, 3},
        {8, 1, 15},
        {7, 9, 4}
    };

    int sum, min, max;
    matrixStats(matrix, &sum, &min, &max);

    printf("Sum: %d\n", sum);
    printf("Min: %d\n", min);
    printf("Max: %d\n", max);

    return 0;
}
