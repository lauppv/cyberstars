#include <stdio.h>

#define MAX_SIDE 25

int rows, cols;
// grid[r][c] is the cell in row r, column c.
char grid[MAX_SIDE][MAX_SIDE + 1];

void paint(int r, int c, char old, char color) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != old) {
        return;
    }
    grid[r][c] = color;
    for (int dr = -1; dr <= 1; dr++) {
        for (int dc = -1; dc <= 1; dc++) {
            paint(r + dr, c + dc, old, color);
        }
    }
}

void flood_fill(int r, int c, char color) {
    if (grid[r][c] != color) {
        paint(r, c, grid[r][c], color);
    }
}

int main(void) {
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        scanf("%s", grid[r]);
    }
    int r, c;
    char color;
    scanf("%d %d %c", &r, &c, &color);
    flood_fill(r, c, color);
    for (int i = 0; i < rows; i++) {
        printf("%s\n", grid[i]);
    }
    return 0;
}
