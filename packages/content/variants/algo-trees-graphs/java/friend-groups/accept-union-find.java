class Solution {
    // adj.get(u) lists the neighbours of vertex u.
    static int find(int[] parent, int v) {
        while (parent[v] != v) {
            parent[v] = parent[parent[v]];
            v = parent[v];
        }
        return v;
    }

    static int countGroups(ArrayList<ArrayList<Integer>> adj) {
        int[] parent = new int[adj.size()];
        for (int v = 0; v < adj.size(); v++) {
            parent[v] = v;
        }
        int groups = adj.size();
        for (int u = 0; u < adj.size(); u++) {
            for (int v : adj.get(u)) {
                int a = find(parent, u);
                int b = find(parent, v);
                if (a != b) {
                    parent[a] = b;
                    groups--;
                }
            }
        }
        return groups;
    }
}
