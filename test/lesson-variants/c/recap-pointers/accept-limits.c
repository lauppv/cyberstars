#include <stdio.h>
#include <limits.h>

void matrix_stats(int matrix[3][3], int *sum, int *min, int *max) {
    int s = 0, lo = INT_MAX, hi = INT_MIN;
    int r = 0;
    while (r < 3) {
        int c = 0;
        while (c < 3) {
            int v = matrix[r][c++];
            s += v;
            if (v < lo) lo = v;
            if (v > hi) hi = v;
        }
        r++;
    }
    *sum = s;
    *min = lo;
    *max = hi;
}

int main(void) {
    int grid[3][3];
    for (int r = 0; r < 3; r++)
        scanf("%d %d %d", &grid[r][0], &grid[r][1], &grid[r][2]);
    int total, smallest, largest;
    matrix_stats(grid, &total, &smallest, &largest);
    printf("Sum: %d\nMin: %d\nMax: %d\n", total, smallest, largest);
    return 0;
}
