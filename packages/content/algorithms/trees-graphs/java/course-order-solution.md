```java
import java.util.PriorityQueue;

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
        PriorityQueue<Integer> ready = new PriorityQueue<>();
        for (int v = 0; v < n; v++) {
            if (indeg[v] == 0) {
                ready.add(v);
            }
        }
        ArrayList<Integer> order = new ArrayList<>();
        while (!ready.isEmpty()) {
            int u = ready.poll();
            order.add(u);
            for (int v : adj.get(u)) {
                indeg[v]--;
                if (indeg[v] == 0) {
                    ready.add(v);
                }
            }
        }
        if (order.size() < n) {
            return new ArrayList<>();
        }
        return order;
    }
}
```
