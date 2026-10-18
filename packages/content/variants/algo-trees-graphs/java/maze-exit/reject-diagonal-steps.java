import java.util.ArrayDeque;

class Solution {
    // grid[r][c] is the cell in row r, column c.
    static int fewestSteps(char[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        int[][] dist = new int[rows][cols];
        ArrayDeque<int[]> queue = new ArrayDeque<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                dist[r][c] = -1;
                if (grid[r][c] == 'A') {
                    dist[r][c] = 0;
                    queue.add(new int[] {r, c});
                }
            }
        }
        while (!queue.isEmpty()) {
            int[] cell = queue.remove();
            if (grid[cell[0]][cell[1]] == 'B') {
                return dist[cell[0]][cell[1]];
            }
            for (int dr = -1; dr <= 1; dr++) {
                for (int dc = -1; dc <= 1; dc++) {
                    int nr = cell[0] + dr;
                    int nc = cell[1] + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                            && grid[nr][nc] != '#' && dist[nr][nc] == -1) {
                        dist[nr][nc] = dist[cell[0]][cell[1]] + 1;
                        queue.add(new int[] {nr, nc});
                    }
                }
            }
        }
        return -1;
    }
}
