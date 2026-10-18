```java
import java.util.*; import java.io.*; {{code: timpSemnal}}

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<int[]>> vecini = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            vecini.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            int cost = scanner.nextInt();
            vecini.get(u).add(new int[] {v, cost});
            vecini.get(v).add(new int[] {u, cost});
        }
        int s = scanner.nextInt();
        System.out.println(new Solutie().timpSemnal(vecini, s));
    }
}
```
