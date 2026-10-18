void sink(int r, int c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '#') {
        return;
    }
    grid[r][c] = '.';
    for (int dr = -1; dr <= 1; dr++) {
        for (int dc = -1; dc <= 1; dc++) {
            sink(r + dr, c + dc);
        }
    }
}

int count_islands(void) {
    int islands = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '#') {
                islands++;
                sink(r, c);
            }
        }
    }
    return islands;
}
