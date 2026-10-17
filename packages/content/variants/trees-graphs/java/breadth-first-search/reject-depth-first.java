import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    static void walk(ArrayList<ArrayList<Integer>> adj, int[] dist, int u, int d) {
        dist[u] = d;
        for (int v : adj.get(u)) {
            if (dist[v] == -1) {
                walk(adj, dist, v, d + 1);
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
        int s = scanner.nextInt();
        int t = scanner.nextInt();

        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        walk(adj, dist, s, 0);

        for (int v = 0; v < n; v++) {
            System.out.println(v + ": " + dist[v]);
        }
        if (dist[t] == -1) {
            System.out.println("No way from " + s + " to " + t);
        } else {
            System.out.println("Fewest steps from " + s + " to " + t + ": " + dist[t]);
        }
    }
}
