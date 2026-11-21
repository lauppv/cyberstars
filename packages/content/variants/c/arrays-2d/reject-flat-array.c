#include <stdio.h>

int count_column(int plane[], int rows, int cols, int col) {
    int n = 0;
    for (int r = 0; r < rows; r++) n += plane[r * cols + col];
    return n;
}

int main(void) {
    int R, C, g[100];
    scanf("%d %d", &R, &C);
    for (int i = 0; i < R * C; i++) scanf("%d", &g[i]);
    for (int r = 0; r < R; r++) {
        int s = 0;
        for (int c = 0; c < C; c++) s += g[r * C + c];
        printf("Row %d: %d\n", r + 1, s);
    }
    int best = 0;
    for (int c = 1; c < C; c++)
        if (count_column(g, R, C, c) > count_column(g, R, C, best)) best = c;
    printf("Busiest column: %d\n", best + 1);
    return 0;
}
