#include <stdio.h>

void matrix_stats(int matrix[3][3], int *sum, int *min, int *max) {
    *sum = 0;
    *min = *max = matrix[0][0];
    for (int (*row)[3] = matrix; row < matrix + 3; row++) {
        for (int *cell = *row; cell < *row + 3; cell++) {
            *sum += *cell;
            if (*cell < *min) *min = *cell;
            if (*cell > *max) *max = *cell;
        }
    }
}

int main(void) {
    int m[3][3];
    for (int k = 0; k < 9; k++) scanf("%d", &m[k / 3][k % 3]);
    int total, lo, hi;
    matrix_stats(m, &total, &lo, &hi);
    printf("Sum: %d\nMin: %d\nMax: %d\n", total, lo, hi);
    return 0;
}
