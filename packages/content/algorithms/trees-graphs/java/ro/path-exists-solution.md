```java
import java.util.ArrayDeque;

class Solutie {
    // vecini.get(u) are vecinii nodului u.
    static boolean existaDrum(ArrayList<ArrayList<Integer>> vecini, int s, int t) {
        boolean[] vazut = new boolean[vecini.size()];
        vazut[s] = true;
        ArrayDeque<Integer> coada = new ArrayDeque<>();
        coada.add(s);
        while (!coada.isEmpty()) {
            int u = coada.remove();
            if (u == t) {
                return true;
            }
            for (int v : vecini.get(u)) {
                if (!vazut[v]) {
                    vazut[v] = true;
                    coada.add(v);
                }
            }
        }
        return false;
    }
}
```
