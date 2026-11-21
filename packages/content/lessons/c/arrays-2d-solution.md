```c
#include <stdio.h>

int count_column(int plane[][10], int rows, int col) {
    int count = 0;
    for (int r = 0; r < rows; r++) {
        if (plane[r][col] == 1) {
            count++;
        }
    }
    return count;
}

int main(void) {
    int rows, cols;
    int plane[10][10];
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            scanf("%d", &plane[r][c]);
        }
    }

    for (int r = 0; r < rows; r++) {
        int ones = 0;
        for (int c = 0; c < cols; c++) {
            ones = ones + plane[r][c];
        }
        printf("Row %d: %d\n", r + 1, ones);
    }

    int best = 0;
    for (int c = 1; c < cols; c++) {
        if (count_column(plane, rows, c) > count_column(plane, rows, best)) {
            best = c;
        }
    }
    printf("Busiest column: %d\n", best + 1);
    return 0;
}
```
