```c
void flood_fill(int r, int c, char color) {
    static int stack[MAX_SIDE * MAX_SIDE][2];
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    char old = grid[r][c];
    if (old == color) {
        return;
    }
    int top = 0;
    grid[r][c] = color;
    stack[top][0] = r;
    stack[top][1] = c;
    top++;
    while (top > 0) {
        top--;
        int cr = stack[top][0];
        int cc = stack[top][1];
        for (int k = 0; k < 4; k++) {
            int nr = cr + dr[k];
            int nc = cc + dc[k];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == old) {
                grid[nr][nc] = color;
                stack[top][0] = nr;
                stack[top][1] = nc;
                top++;
            }
        }
    }
}
```
