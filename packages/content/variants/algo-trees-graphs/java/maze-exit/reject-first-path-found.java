import java.util.ArrayDeque;
import java.util.Scanner;

public class Main {
    // grid[r][c] is the cell in row r, column c.
    static int fewestSteps(char[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        int[][] depth = new int[rows][cols];
        ArrayDeque<int[]> stack = new ArrayDeque<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                depth[r][c] = -1;
                if (grid[r][c] == 'A') {
                    depth[r][c] = 0;
                    stack.push(new int[] {r, c});
                }
            }
        }
        while (!stack.isEmpty()) {
            int[] cell = stack.pop();
            if (grid[cell[0]][cell[1]] == 'B') {
                return depth[cell[0]][cell[1]];
            }
            for (int k = 0; k < 4; k++) {
                int nr = cell[0] + dr[k];
                int nc = cell[1] + dc[k];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                        && grid[nr][nc] != '#' && depth[nr][nc] == -1) {
                    depth[nr][nc] = depth[cell[0]][cell[1]] + 1;
                    stack.push(new int[] {nr, nc});
                }
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int rows = scanner.nextInt();
        int cols = scanner.nextInt();
        char[][] grid = new char[rows][cols];
        for (int r = 0; r < rows; r++) {
            String line = scanner.next();
            for (int c = 0; c < cols; c++) {
                grid[r][c] = line.charAt(c);
            }
        }
        System.out.println(fewestSteps(grid));
    }
}
