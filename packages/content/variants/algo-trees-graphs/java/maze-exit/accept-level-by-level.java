import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    // grid[r][c] is the cell in row r, column c.
    static int fewestSteps(char[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        boolean[][] seen = new boolean[rows][cols];
        ArrayList<int[]> frontier = new ArrayList<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 'A') {
                    seen[r][c] = true;
                    frontier.add(new int[] {r, c});
                }
            }
        }
        int steps = 0;
        while (!frontier.isEmpty()) {
            ArrayList<int[]> following = new ArrayList<>();
            for (int[] cell : frontier) {
                if (grid[cell[0]][cell[1]] == 'B') {
                    return steps;
                }
                for (int k = 0; k < 4; k++) {
                    int nr = cell[0] + dr[k];
                    int nc = cell[1] + dc[k];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                            && grid[nr][nc] != '#' && !seen[nr][nc]) {
                        seen[nr][nc] = true;
                        following.add(new int[] {nr, nc});
                    }
                }
            }
            frontier = following;
            steps++;
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
