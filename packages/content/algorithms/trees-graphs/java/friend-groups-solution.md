```java
import java.util.ArrayDeque;

class Solution {
    // adj.get(u) lists the neighbours of vertex u.
    static int countGroups(ArrayList<ArrayList<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        int groups = 0;
        for (int start = 0; start < adj.size(); start++) {
            if (seen[start]) {
                continue;
            }
            groups++;
            seen[start] = true;
            ArrayDeque<Integer> stack = new ArrayDeque<>();
            stack.push(start);
            while (!stack.isEmpty()) {
                int u = stack.pop();
                for (int v : adj.get(u)) {
                    if (!seen[v]) {
                        seen[v] = true;
                        stack.push(v);
                    }
                }
            }
        }
        return groups;
    }
}
```
