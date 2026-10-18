class Solution {
    // adj.get(u) lists the neighbours of vertex u.
    static int countGroups(ArrayList<ArrayList<Integer>> adj) {
        int ends = 0;
        for (ArrayList<Integer> friends : adj) {
            ends += friends.size();
        }
        return adj.size() - ends / 2;
    }
}
