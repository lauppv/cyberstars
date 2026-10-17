#include <stdio.h>

#define MAX_SIDE 25

int rows, cols;
// grid[r][c] is the cell in row r, column c.
char grid[MAX_SIDE][MAX_SIDE + 1];

int minutes_to_rot(void) {
    static int rotting[MAX_SIDE * MAX_SIDE][2];
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int minutes = 0;
    while (1) {
        int size = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] != 'o') {
                    continue;
                }
                for (int k = 0; k < 4; k++) {
                    int nr = r + dr[k];
                    int nc = c + dc[k];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 'x') {
                        rotting[size][0] = r;
                        rotting[size][1] = c;
                        size++;
                        break;
                    }
                }
            }
        }
        if (size == 0) {
            break;
        }
        for (int i = 0; i < size; i++) {
            grid[rotting[i][0]][rotting[i][1]] = 'x';
        }
        minutes++;
    }
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 'o') {
                return -1;
            }
        }
    }
    return minutes;
}

int main(void) {
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        scanf("%s", grid[r]);
    }
    printf("%d\n", minutes_to_rot());
    return 0;
}
