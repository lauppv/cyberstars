import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Queue;
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
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }
        int s = scanner.nextInt();
        int t = scanner.nextInt();

        int[] dist = new int[n];
        Arrays.fill(dist, 0);
        boolean[] seen = new boolean[n];
        seen[s] = true;
        dist[s] = 0;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.add(s);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : adj.get(u)) {
                if (!seen[v]) {
                    seen[v] = true;
                    dist[v] = dist[u] + 1;
                    queue.add(v);
                }
            }
        }

        for (int v = 0; v < n; v++) {
            System.out.println(v + ": " + dist[v]);
        }
        System.out.println("Fewest steps from " + s + " to " + t + ": " + dist[t]);
    }
}
