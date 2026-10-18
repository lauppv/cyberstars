#include <stdbool.h>

int fewest_steps(void) {
    static int frontier[MAX_SIDE * MAX_SIDE][2];
    static int following[MAX_SIDE * MAX_SIDE][2];
    bool seen[MAX_SIDE][MAX_SIDE] = {{false}};
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int size = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 'A') {
                seen[r][c] = true;
                frontier[size][0] = r;
                frontier[size][1] = c;
                size++;
            }
        }
    }
    for (int steps = 0; size > 0; steps++) {
        int next = 0;
        for (int i = 0; i < size; i++) {
            int r = frontier[i][0];
            int c = frontier[i][1];
            if (grid[r][c] == 'B') {
                return steps;
            }
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k];
                int nc = c + dc[k];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                        && grid[nr][nc] != '#' && !seen[nr][nc]) {
                    seen[nr][nc] = true;
                    following[next][0] = nr;
                    following[next][1] = nc;
                    next++;
                }
            }
        }
        for (int i = 0; i < next; i++) {
            frontier[i][0] = following[i][0];
            frontier[i][1] = following[i][1];
        }
        size = next;
    }
    return -1;
}
