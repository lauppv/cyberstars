```c
#include <stdio.h>

#define MAX_SIDE 25

int rows, cols;
// grid[r][c] is the cell in row r, column c.
char grid[MAX_SIDE][MAX_SIDE + 1];

int fewest_steps(void) {
    static int queue[MAX_SIDE * MAX_SIDE][2];
    int dist[MAX_SIDE][MAX_SIDE];
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int head = 0;
    int tail = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            dist[r][c] = -1;
            if (grid[r][c] == 'A') {
                dist[r][c] = 0;
                queue[tail][0] = r;
                queue[tail][1] = c;
                tail++;
            }
        }
    }
    while (head < tail) {
        int cr = queue[head][0];
        int cc = queue[head][1];
        head++;
        if (grid[cr][cc] == 'B') {
            return dist[cr][cc];
        }
        for (int k = 0; k < 4; k++) {
            int nr = cr + dr[k];
            int nc = cc + dc[k];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && grid[nr][nc] != '#' && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[cr][cc] + 1;
                queue[tail][0] = nr;
                queue[tail][1] = nc;
                tail++;
            }
        }
    }
    return -1;
}

int main(void) {
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        scanf("%s", grid[r]);
    }
    printf("%d\n", fewest_steps());
    return 0;
}
```
