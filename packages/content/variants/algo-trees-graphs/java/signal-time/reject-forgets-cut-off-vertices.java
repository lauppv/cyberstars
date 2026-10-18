import java.util.Arrays;
import java.util.PriorityQueue;

class Solution {
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
}
