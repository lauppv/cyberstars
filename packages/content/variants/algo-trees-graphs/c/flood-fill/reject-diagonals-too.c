void paint(int r, int c, char old, char color) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != old) {
        return;
    }
    grid[r][c] = color;
    for (int dr = -1; dr <= 1; dr++) {
        for (int dc = -1; dc <= 1; dc++) {
            paint(r + dr, c + dc, old, color);
        }
    }
}

void flood_fill(int r, int c, char color) {
    if (grid[r][c] != color) {
        paint(r, c, grid[r][c], color);
    }
}
