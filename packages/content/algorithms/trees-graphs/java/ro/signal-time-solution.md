```java
import java.util.Arrays;
import java.util.PriorityQueue;

class Solutie {
    // vecini.get(u) are perechi {v, cost}: un cablu intre u si v pe care semnalul merge cost minute.
    static int timpSemnal(ArrayList<ArrayList<int[]>> vecini, int s) {
        int[] distanta = new int[vecini.size()];
        Arrays.fill(distanta, -1);
        distanta[s] = 0;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.add(new int[] {0, s});
        while (!heap.isEmpty()) {
            int[] varf = heap.poll();
            int d = varf[0];
            int u = varf[1];
            if (d > distanta[u]) {
                continue;
            }
            for (int[] muchie : vecini.get(u)) {
                int v = muchie[0];
                int cost = muchie[1];
                if (distanta[v] == -1 || d + cost < distanta[v]) {
                    distanta[v] = d + cost;
                    heap.add(new int[] {distanta[v], v});
                }
            }
        }
        int cel_mai_lent = 0;
        for (int d : distanta) {
            if (d == -1) {
                return -1;
            }
            cel_mai_lent = Math.max(cel_mai_lent, d);
        }
        return cel_mai_lent;
    }
}
```
