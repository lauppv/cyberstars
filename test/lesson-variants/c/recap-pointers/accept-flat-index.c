#include <stdio.h>

void matrix_stats(int matrix[3][3], int *sum, int *min, int *max) {
    *sum = 0;
    for (int k = 0; k < 9; k++) {
        int v = matrix[k / 3][k % 3];
        if (k == 0 || v < *min) *min = v;
        if (k == 0 || v > *max) *max = v;
        *sum += v;
    }
}

int main(void) {
    int matrix[3][3];
    for (int k = 0; k < 9; k++) scanf("%d", &matrix[k / 3][k % 3]);
    int a, b, c;
    matrix_stats(matrix, &a, &b, &c);
    printf("Sum: %d\n", a);
    printf("Min: %d\n", b);
    printf("Max: %d\n", c);
    return 0;
}
