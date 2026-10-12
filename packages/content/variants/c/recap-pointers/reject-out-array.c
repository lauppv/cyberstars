#include <stdio.h>

void matrix_stats(int matrix[3][3], int out[3]) {
    out[0] = 0;
    out[1] = out[2] = matrix[0][0];
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            out[0] += matrix[i][j];
            if (matrix[i][j] < out[1]) out[1] = matrix[i][j];
            if (matrix[i][j] > out[2]) out[2] = matrix[i][j];
        }
    }
}

int main(void) {
    int matrix[3][3], stats[3];
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++) scanf("%d", &matrix[i][j]);
    matrix_stats(matrix, stats);
    printf("Sum: %d\nMin: %d\nMax: %d\n", stats[0], stats[1], stats[2]);
    return 0;
}
