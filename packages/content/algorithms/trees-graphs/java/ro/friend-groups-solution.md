```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
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

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<Integer>> vecini = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            vecini.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            vecini.get(u).add(v);
            vecini.get(v).add(u);
        }
        System.out.println(numaraGrupuri(vecini));
    }
}
```
