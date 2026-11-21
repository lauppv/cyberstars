#include <stdio.h>

int count_column(int plane[][10], int rows, int col) {
    int n = 0;
    for (int r = 0; r < rows; r++) n += plane[r][col];
    return n;
}

int main(void) {
    int R, C, g[10][10];
    scanf("%d %d", &R, &C);
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++) scanf("%d", &g[r][c]);
    for (int r = 0; r < R; r++) {
        int s = 0;
        for (int c = 0; c < C; c++) s += g[r][c];
        printf("Row %d: %d\n", r + 1, s);
    }
    int best = 0;
    for (int c = 1; c < C; c++)
        if (count_column(g, R, c) > count_column(g, R, best)) best = c;
    printf("Busiest column: %d\n", best);
    return 0;
}
