```java
import java.util.PriorityQueue;

class Solutie {
    // vecini.get(u) are cursurile care au nevoie intai de u.
    static ArrayList<Integer> ordineCursuri(ArrayList<ArrayList<Integer>> vecini) {
        int n = vecini.size();
        int[] grad = new int[n];
        for (int u = 0; u < n; u++) {
            for (int v : vecini.get(u)) {
                grad[v]++;
            }
        }
        PriorityQueue<Integer> gata = new PriorityQueue<>();
        for (int v = 0; v < n; v++) {
            if (grad[v] == 0) {
                gata.add(v);
            }
        }
        ArrayList<Integer> ordine = new ArrayList<>();
        while (!gata.isEmpty()) {
            int u = gata.poll();
            ordine.add(u);
            for (int v : vecini.get(u)) {
                grad[v]--;
                if (grad[v] == 0) {
                    gata.add(v);
                }
            }
        }
        if (ordine.size() < n) {
            return new ArrayList<>();
        }
        return ordine;
    }
}
```
