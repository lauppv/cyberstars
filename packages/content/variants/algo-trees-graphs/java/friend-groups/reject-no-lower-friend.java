class Solution {
    // adj.get(u) lists the neighbours of vertex u.
    static int countGroups(ArrayList<ArrayList<Integer>> adj) {
        int groups = 0;
        for (int u = 0; u < adj.size(); u++) {
            boolean lower = false;
            for (int v : adj.get(u)) {
                if (v < u) {
                    lower = true;
                }
            }
            if (!lower) {
                groups++;
            }
        }
        return groups;
    }
}
