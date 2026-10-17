import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    // grid[r][c] is the cell in row r, column c.
    static int minutesToRot(char[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        int minutes = 0;
        while (true) {
            ArrayList<int[]> rotting = new ArrayList<>();
            for (int r = 0; r < rows; r++) {
                for (int c = 0; c < cols; c++) {
                    if (grid[r][c] != 'o') {
                        continue;
                    }
                    for (int k = 0; k < 4; k++) {
                        int nr = r + dr[k];
                        int nc = c + dc[k];
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 'x') {
                            rotting.add(new int[] {r, c});
                            break;
                        }
                    }
                }
            }
            if (rotting.isEmpty()) {
                break;
            }
            for (int[] cell : rotting) {
                grid[cell[0]][cell[1]] = 'x';
            }
            minutes++;
        }
        for (char[] row : grid) {
            for (char cell : row) {
                if (cell == 'o') {
                    return -1;
                }
            }
        }
        return minutes;
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
        System.out.println(minutesToRot(grid));
    }
}
