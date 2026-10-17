```c
#include <stdio.h>

#define MAX_SIDE 25

int rows, cols;
// grid[r][c] is the cell in row r, column c.
char grid[MAX_SIDE][MAX_SIDE + 1];

int minutes_to_rot(void) {
    static int queue[MAX_SIDE * MAX_SIDE][2];
    int minute[MAX_SIDE][MAX_SIDE];
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int head = 0;
    int tail = 0;
    int fresh = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            minute[r][c] = -1;
            if (grid[r][c] == 'x') {
                minute[r][c] = 0;
                queue[tail][0] = r;
                queue[tail][1] = c;
                tail++;
            } else if (grid[r][c] == 'o') {
                fresh++;
            }
        }
    }
    int last = 0;
    while (head < tail) {
        int cr = queue[head][0];
        int cc = queue[head][1];
        head++;
        for (int k = 0; k < 4; k++) {
            int nr = cr + dr[k];
            int nc = cc + dc[k];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && grid[nr][nc] == 'o' && minute[nr][nc] == -1) {
                minute[nr][nc] = minute[cr][cc] + 1;
                last = minute[nr][nc];
                fresh--;
                queue[tail][0] = nr;
                queue[tail][1] = nc;
                tail++;
            }
        }
    }
    if (fresh > 0) {
        return -1;
    }
    return last;
}

int main(void) {
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        scanf("%s", grid[r]);
    }
    printf("%d\n", minutes_to_rot());
    return 0;
}
```
