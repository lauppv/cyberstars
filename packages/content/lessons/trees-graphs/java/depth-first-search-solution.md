```java
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    static void dfs(ArrayList<ArrayList<Integer>> adj, int[] piece, int u, int p) {
        piece[u] = p;
        for (int v : adj.get(u)) {
            if (piece[v] == 0) {
                dfs(adj, piece, v, p);
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            adj.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }

        int[] piece = new int[n];
        int count = 0;
        for (int v = 0; v < n; v++) {
            if (piece[v] == 0) {
                count++;
                dfs(adj, piece, v, count);
            }
        }

        System.out.println("Pieces: " + count);
        for (int p = 1; p <= count; p++) {
            System.out.print("Piece " + p + ":");
            for (int v = 0; v < n; v++) {
                if (piece[v] == p) {
                    System.out.print(" " + v);
                }
            }
            System.out.println();
        }
    }
}
```
