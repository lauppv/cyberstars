```java
import java.util.*; import java.io.*; {{code: ordineCursuri}}

public class Main {

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
        }
        ArrayList<Integer> ordine = new Solutie().ordineCursuri(vecini);
        if (ordine.isEmpty()) {
            System.out.println(-1);
            return;
        }
        StringBuilder linie = new StringBuilder();
        for (int i = 0; i < ordine.size(); i++) {
            if (i > 0) {
                linie.append(' ');
            }
            linie.append(ordine.get(i));
        }
        System.out.println(linie);
    }
}
```
