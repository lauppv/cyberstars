class Solution {
    // adj.get(u) lists the neighbours of vertex u.
    static boolean pathExists(ArrayList<ArrayList<Integer>> adj, int s, int t) {
        return s == t || adj.get(s).contains(t);
    }
}
