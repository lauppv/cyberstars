```java
import java.util.ArrayDeque;

class Solution {
    // adj.get(u) lists the neighbours of vertex u.
    static boolean pathExists(ArrayList<ArrayList<Integer>> adj, int s, int t) {
        boolean[] seen = new boolean[adj.size()];
        seen[s] = true;
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.add(s);
        while (!queue.isEmpty()) {
            int u = queue.remove();
            if (u == t) {
                return true;
            }
            for (int v : adj.get(u)) {
                if (!seen[v]) {
                    seen[v] = true;
                    queue.add(v);
                }
            }
        }
        return false;
    }
}
```
