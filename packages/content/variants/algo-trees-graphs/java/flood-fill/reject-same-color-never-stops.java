class Solution {
    // grid[r][c] is the cell in row r, column c.
    static void paint(char[][] grid, int r, int c, char old, char color) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != old) {
            return;
        }
        grid[r][c] = color;
        paint(grid, r - 1, c, old, color);
        paint(grid, r + 1, c, old, color);
        paint(grid, r, c - 1, old, color);
        paint(grid, r, c + 1, old, color);
    }

    static void floodFill(char[][] grid, int r, int c, char color) {
        paint(grid, r, c, grid[r][c], color);
    }
}
