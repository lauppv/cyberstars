import java.util.Scanner;

public class Main {
    // grid[r][c] is the cell in row r, column c.
    static int countIslands(char[][] grid) {
        int corners = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] != '#') {
                    continue;
                }
                boolean up = r > 0 && grid[r - 1][c] == '#';
                boolean left = c > 0 && grid[r][c - 1] == '#';
                if (!up && !left) {
                    corners++;
                }
            }
        }
        return corners;
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
        System.out.println(countIslands(grid));
    }
}
