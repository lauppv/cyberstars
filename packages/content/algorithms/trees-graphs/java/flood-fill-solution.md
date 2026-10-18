```java
import java.util.ArrayDeque;

class Solution {
    // grid[r][c] is the cell in row r, column c.
    static void floodFill(char[][] grid, int r, int c, char color) {
        char old = grid[r][c];
        if (old == color) {
            return;
        }
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        grid[r][c] = color;
        ArrayDeque<int[]> stack = new ArrayDeque<>();
        stack.push(new int[] {r, c});
        while (!stack.isEmpty()) {
            int[] cell = stack.pop();
            for (int k = 0; k < 4; k++) {
                int nr = cell[0] + dr[k];
                int nc = cell[1] + dc[k];
                if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length
                        && grid[nr][nc] == old) {
                    grid[nr][nc] = color;
                    stack.push(new int[] {nr, nc});
                }
            }
        }
    }
}
```
