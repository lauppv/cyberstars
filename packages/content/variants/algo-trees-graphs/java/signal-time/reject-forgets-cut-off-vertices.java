import java.util.ArrayList;
import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Scanner;

public class Main {
    // adj.get(u) lists {v, w} pairs: a cable between u and v that takes w minutes.
    static int signalTime(ArrayList<ArrayList<int[]>> adj, int s) {
        int[] dist = new int[adj.size()];
        Arrays.fill(dist, -1);
        dist[s] = 0;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.add(new int[] {0, s});
        while (!heap.isEmpty()) {
            int[] top = heap.poll();
            int d = top[0];
            int u = top[1];
            if (d > dist[u]) {
                continue;
            }
            for (int[] edge : adj.get(u)) {
                int v = edge[0];
                int w = edge[1];
                if (dist[v] == -1 || d + w < dist[v]) {
                    dist[v] = d + w;
                    heap.add(new int[] {dist[v], v});
                }
            }
        }
        int slowest = 0;
        for (int d : dist) {
            slowest = Math.max(slowest, d);
        }
        return slowest;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<int[]>> adj = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            adj.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            int w = scanner.nextInt();
            adj.get(u).add(new int[] {v, w});
            adj.get(v).add(new int[] {u, w});
        }
        int s = scanner.nextInt();
        System.out.println(signalTime(adj, s));
    }
}
