#include <stdio.h>

#define MAX_SIDE 25

int rows, cols;
// grid[r][c] is the cell in row r, column c.
char grid[MAX_SIDE][MAX_SIDE + 1];

int count_islands(void) {
    int corners = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] != '#') {
                continue;
            }
            int up = r > 0 && grid[r - 1][c] == '#';
            int left = c > 0 && grid[r][c - 1] == '#';
            if (!up && !left) {
                corners++;
            }
        }
    }
    return corners;
}

int main(void) {
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        scanf("%s", grid[r]);
    }
    printf("%d\n", count_islands());
    return 0;
}
