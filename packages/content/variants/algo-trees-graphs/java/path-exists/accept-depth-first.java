class Solution {
    // adj.get(u) lists the neighbours of vertex u.
    static void visit(ArrayList<ArrayList<Integer>> adj, boolean[] seen, int u) {
        seen[u] = true;
        for (int v : adj.get(u)) {
            if (!seen[v]) {
                visit(adj, seen, v);
            }
        }
    }

    static boolean pathExists(ArrayList<ArrayList<Integer>> adj, int s, int t) {
        boolean[] seen = new boolean[adj.size()];
        visit(adj, seen, s);
        return seen[t];
    }
}
