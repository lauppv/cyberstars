import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    static void spread(ArrayList<ArrayList<int[]>> adj, int[] piece, int u, int p) {
        piece[u] = p;
        for (int[] edge : adj.get(u)) {
            if (piece[edge[0]] == 0) {
                spread(adj, piece, edge[0], p);
            }
        }
    }

    static void writeRow(String label, int[] values) {
        System.out.print(label);
        for (int value : values) {
            System.out.print(" " + value);
        }
        System.out.println();
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

        int[] piece = new int[n];
        int pieces = 0;
        for (int v = 0; v < n; v++) {
            if (piece[v] == 0) {
                pieces++;
                spread(adj, piece, v, pieces);
            }
        }

        int[] steps = new int[n];
        Arrays.fill(steps, -1);
        steps[s] = 0;
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.add(s);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int[] edge : adj.get(u)) {
                int v = edge[0];
                if (steps[v] == -1) {
                    steps[v] = steps[u] + 1;
                    queue.add(v);
                }
            }
        }

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

        System.out.println("Pieces: " + pieces);
        writeRow("Steps:", steps);
        writeRow("Distances:", dist);
    }
}
