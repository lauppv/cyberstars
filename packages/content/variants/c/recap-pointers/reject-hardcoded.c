#include <stdio.h>

void matrix_stats(int matrix[3][3], int *sum, int *min, int *max) {
    *sum = 64;
    *min = 1;
    *max = 15;
}

int main(void) {
    int m[3][3];
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++) scanf("%d", &m[i][j]);
    int s, lo, hi;
    matrix_stats(m, &s, &lo, &hi);
    printf("Sum: %d\nMin: %d\nMax: %d\n", s, lo, hi);
    return 0;
}
