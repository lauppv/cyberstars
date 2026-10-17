import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] matrix = new int[n][n];
        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            adj.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            matrix[u][v] = 1;
            adj.get(u).add(v);
        }

        System.out.println("Matrix:");
        for (int u = 0; u < n; u++) {
            for (int v = 0; v < n; v++) {
                System.out.print(matrix[u][v] + " ");
            }
            System.out.println();
        }

        System.out.println("List:");
        for (int v = 0; v < n; v++) {
            System.out.print(v + ":");
            for (int next : adj.get(v)) {
                System.out.print(" " + next);
            }
            System.out.println();
        }
    }
}
