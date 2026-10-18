class Solution {
    // adj.get(u) lists the courses that need u first.
    static ArrayList<Integer> courseOrder(ArrayList<ArrayList<Integer>> adj) {
        int n = adj.size();
        int[] indeg = new int[n];
        for (int u = 0; u < n; u++) {
            for (int v : adj.get(u)) {
                indeg[v]++;
            }
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
            if (u == -1) {
                return new ArrayList<>();
            }
            done[u] = true;
            order.add(u);
            for (int v : adj.get(u)) {
                indeg[v]--;
            }
        }
        return order;
    }
}
