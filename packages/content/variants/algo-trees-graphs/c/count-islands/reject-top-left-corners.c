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
