#include <stdio.h>

#define MAX_SIDE 25

int rows, cols;
// grid[r][c] is the cell in row r, column c.
char grid[MAX_SIDE][MAX_SIDE + 1];

void sink(int r, int c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '#') {
        return;
    }
    grid[r][c] = '.';
    sink(r - 1, c);
    sink(r + 1, c);
    sink(r, c - 1);
    sink(r, c + 1);
}

int count_islands(void) {
    int islands = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '#') {
                islands++;
                sink(r, c);
            }
        }
    }
    return islands;
}

int main(void) {
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        scanf("%s", grid[r]);
    }
    printf("%d\n", count_islands());
    return 0;
}
