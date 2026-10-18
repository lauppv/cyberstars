class Solution {
    // grid[r][c] is the cell in row r, column c.
    static void sink(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '#') {
            return;
        }
        grid[r][c] = '.';
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                sink(grid, r + dr, c + dc);
            }
        }
    }

    static int countIslands(char[][] grid) {
        int islands = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '#') {
                    islands++;
                    sink(grid, r, c);
                }
            }
        }
        return islands;
    }
}
