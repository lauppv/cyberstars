int fewest_steps(void) {
    static int stack[MAX_SIDE * MAX_SIDE][2];
    int depth[MAX_SIDE][MAX_SIDE];
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int top = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            depth[r][c] = -1;
            if (grid[r][c] == 'A') {
                depth[r][c] = 0;
                stack[top][0] = r;
                stack[top][1] = c;
                top++;
            }
        }
    }
    while (top > 0) {
        top--;
        int cr = stack[top][0];
        int cc = stack[top][1];
        if (grid[cr][cc] == 'B') {
            return depth[cr][cc];
        }
        for (int k = 0; k < 4; k++) {
            int nr = cr + dr[k];
            int nc = cc + dc[k];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && grid[nr][nc] != '#' && depth[nr][nc] == -1) {
                depth[nr][nc] = depth[cr][cc] + 1;
                stack[top][0] = nr;
                stack[top][1] = nc;
                top++;
            }
        }
    }
    return -1;
}
