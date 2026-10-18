int fewest_steps(void) {
    static int queue[MAX_SIDE * MAX_SIDE][2];
    int dist[MAX_SIDE][MAX_SIDE];
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
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                int nr = cr + dr;
                int nc = cc + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                        && grid[nr][nc] != '#' && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[cr][cc] + 1;
                    queue[tail][0] = nr;
                    queue[tail][1] = nc;
                    tail++;
                }
            }
        }
    }
    return -1;
}
