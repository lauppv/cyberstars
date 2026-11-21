#include <stdio.h>

int count_column(int plane[][10], int rows, int col) {
    int total = 0;
    for (int r = 0; r < rows; r++) total += plane[r][col];
    return total;
}

int main(void) {
    int R, C, g[10][10];
    scanf("%d%d", &R, &C);
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++) scanf("%d", &g[r][c]);
    int best = 0, bestCount = -1;
    for (int r = 0; r < R; r++) {
        int s = 0;
        for (int c = 0; c < C; c++) s += g[r][c];
        printf("Row %d: %d\n", r + 1, s);
    }
    for (int c = 0; c < C; c++) {
        int n = count_column(g, R, c);
        if (n > bestCount) { bestCount = n; best = c; }
    }
    printf("Busiest column: %d\n", best + 1);
    return 0;
}
