import java.util.ArrayList;
import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Scanner;

public class Main {
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
        }
        int s = scanner.nextInt();

        int[] dist = new int[n];
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

        for (int v = 0; v < n; v++) {
            System.out.println(v + ": " + dist[v]);
        }
    }
}
