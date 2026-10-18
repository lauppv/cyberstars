import java.util.ArrayDeque;
import java.util.Arrays;

class Solution {
    // adj.get(u) lists {v, w} pairs: a cable between u and v that takes w minutes.
    static int signalTime(ArrayList<ArrayList<int[]>> adj, int s) {
        int[] dist = new int[adj.size()];
        Arrays.fill(dist, -1);
        dist[s] = 0;
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.add(s);
        while (!queue.isEmpty()) {
            int u = queue.remove();
            for (int[] edge : adj.get(u)) {
                int v = edge[0];
                if (dist[v] == -1) {
                    dist[v] = dist[u] + edge[1];
                    queue.add(v);
                }
            }
        }
        int slowest = 0;
        for (int d : dist) {
            if (d == -1) {
                return -1;
            }
            slowest = Math.max(slowest, d);
        }
        return slowest;
    }
}
