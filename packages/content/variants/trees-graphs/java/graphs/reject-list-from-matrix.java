import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            matrix[u][v] = 1;
            matrix[v][u] = 1;
        }

        System.out.println("Matrix:");
        for (int u = 0; u < n; u++) {
            for (int v = 0; v < n; v++) {
                System.out.print(matrix[u][v] + " ");
            }
            System.out.println();
        }

        System.out.println("List:");
        for (int u = 0; u < n; u++) {
            System.out.print(u + ":");
            for (int v = 0; v < n; v++) {
                if (matrix[u][v] == 1) {
                    System.out.print(" " + v);
                }
            }
            System.out.println();
        }
    }
}
