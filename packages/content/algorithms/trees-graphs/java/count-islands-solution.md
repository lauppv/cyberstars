```java
import java.util.ArrayDeque;

class Solution {
    // grid[r][c] is the cell in row r, column c.
    static int countIslands(char[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        boolean[][] seen = new boolean[rows][cols];
        int islands = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] != '#' || seen[r][c]) {
                    continue;
                }
                islands++;
                seen[r][c] = true;
                ArrayDeque<int[]> queue = new ArrayDeque<>();
                queue.add(new int[] {r, c});
                while (!queue.isEmpty()) {
                    int[] cell = queue.remove();
                    for (int k = 0; k < 4; k++) {
                        int nr = cell[0] + dr[k];
                        int nc = cell[1] + dc[k];
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                                && grid[nr][nc] == '#' && !seen[nr][nc]) {
                            seen[nr][nc] = true;
                            queue.add(new int[] {nr, nc});
                        }
                    }
                }
            }
        }
        return islands;
    }
}
```
