import java.util.Scanner;

public class Main {
    // grid[r][c] is the cell in row r, column c.
    static void sink(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '#') {
            return;
        }
        grid[r][c] = '.';
        sink(grid, r - 1, c);
        sink(grid, r + 1, c);
        sink(grid, r, c - 1);
        sink(grid, r, c + 1);
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
