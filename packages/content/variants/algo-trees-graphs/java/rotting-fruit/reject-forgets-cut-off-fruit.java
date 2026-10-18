import java.util.ArrayDeque;

class Solution {
    // grid[r][c] is the cell in row r, column c.
    static int minutesToRot(char[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        int[][] minute = new int[rows][cols];
        ArrayDeque<int[]> queue = new ArrayDeque<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                minute[r][c] = -1;
                if (grid[r][c] == 'x') {
                    minute[r][c] = 0;
                    queue.add(new int[] {r, c});
                }
            }
        }
        int last = 0;
        while (!queue.isEmpty()) {
            int[] cell = queue.remove();
            for (int k = 0; k < 4; k++) {
                int nr = cell[0] + dr[k];
                int nc = cell[1] + dc[k];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                        && grid[nr][nc] == 'o' && minute[nr][nc] == -1) {
                    minute[nr][nc] = minute[cell[0]][cell[1]] + 1;
                    last = minute[nr][nc];
                    queue.add(new int[] {nr, nc});
                }
            }
        }
        return last;
    }
}
