int minutes_to_rot(void) {
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int minutes = 0;
    while (1) {
        int changed = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] != 'o') {
                    continue;
                }
                for (int k = 0; k < 4; k++) {
                    int nr = r + dr[k];
                    int nc = c + dc[k];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 'x') {
                        grid[r][c] = 'x';
                        changed = 1;
                        break;
                    }
                }
            }
        }
        if (!changed) {
            break;
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
