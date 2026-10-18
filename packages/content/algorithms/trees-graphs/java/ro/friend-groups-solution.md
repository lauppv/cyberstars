```java
import java.util.ArrayDeque;

class Solutie {
    // vecini.get(u) are vecinii nodului u.
    static int numaraGrupuri(ArrayList<ArrayList<Integer>> vecini) {
        boolean[] vazut = new boolean[vecini.size()];
        int grupuri = 0;
        for (int start = 0; start < vecini.size(); start++) {
            if (vazut[start]) {
                continue;
            }
            grupuri++;
            vazut[start] = true;
            ArrayDeque<Integer> stiva = new ArrayDeque<>();
            stiva.push(start);
            while (!stiva.isEmpty()) {
                int u = stiva.pop();
                for (int v : vecini.get(u)) {
                    if (!vazut[v]) {
                        vazut[v] = true;
                        stiva.push(v);
                    }
                }
            }
        }
        return grupuri;
    }
}
```
