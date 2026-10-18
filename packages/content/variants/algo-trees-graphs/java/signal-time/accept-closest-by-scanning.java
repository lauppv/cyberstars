import java.util.Arrays;

class Solution {
    // adj.get(u) lists {v, w} pairs: a cable between u and v that takes w minutes.
    static int signalTime(ArrayList<ArrayList<int[]>> adj, int s) {
        int n = adj.size();
        int[] dist = new int[n];
        boolean[] done = new boolean[n];
        Arrays.fill(dist, -1);
        dist[s] = 0;
        int slowest = 0;
        for (int step = 0; step < n; step++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!done[v] && dist[v] != -1 && (u == -1 || dist[v] < dist[u])) {
                    u = v;
                }
            }
            if (u == -1) {
                return -1;
            }
            done[u] = true;
            slowest = dist[u];
            for (int[] edge : adj.get(u)) {
                int v = edge[0];
                if (dist[v] == -1 || dist[u] + edge[1] < dist[v]) {
                    dist[v] = dist[u] + edge[1];
                }
            }
        }
        return slowest;
    }
}
