import java.util.Scanner;

public class Main {
    // grid[r][c] is the cell in row r, column c.
    static void paint(char[][] grid, int r, int c, char old, char color) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != old) {
            return;
        }
        grid[r][c] = color;
        paint(grid, r - 1, c, old, color);
        paint(grid, r + 1, c, old, color);
        paint(grid, r, c - 1, old, color);
        paint(grid, r, c + 1, old, color);
    }

    static void floodFill(char[][] grid, int r, int c, char color) {
        if (grid[r][c] != color) {
            paint(grid, r, c, grid[r][c], color);
        }
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
        int r = scanner.nextInt();
        int c = scanner.nextInt();
        char color = scanner.next().charAt(0);
        floodFill(grid, r, c, color);
        for (char[] row : grid) {
            System.out.println(new String(row));
        }
    }
}
