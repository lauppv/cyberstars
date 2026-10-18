void paint(int r, int c, char old, char color) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != old) {
        return;
    }
    grid[r][c] = color;
    paint(r - 1, c, old, color);
    paint(r + 1, c, old, color);
    paint(r, c - 1, old, color);
    paint(r, c + 1, old, color);
}

void flood_fill(int r, int c, char color) {
    if (grid[r][c] != color) {
        paint(r, c, grid[r][c], color);
    }
}
