```java
import java.util.*; import java.io.*; {{code: numaraGrupuri}}

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
            vecini.get(v).add(u);
        }
        System.out.println(new Solutie().numaraGrupuri(vecini));
    }
}
```
