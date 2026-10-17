import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            adj.add(new ArrayList<>());
        }
        int[] indeg = new int[n];
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            adj.get(u).add(v);
            indeg[v]++;
        }

        boolean[] done = new boolean[n];
        ArrayList<Integer> order = new ArrayList<>();
        for (int step = 0; step < n; step++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!done[v] && indeg[v] == 0) {
                    u = v;
                    break;
                }
            }
            done[u] = true;
            order.add(u);
            for (int v : adj.get(u)) {
                indeg[v]--;
            }
        }

        {
            System.out.print("Order:");
            for (int v : order) {
                System.out.print(" " + v);
            }
            System.out.println();
        }
    }
}
