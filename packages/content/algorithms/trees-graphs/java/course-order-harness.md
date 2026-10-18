```java
import java.util.*; import java.io.*; {{code: courseOrder}}

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            adj.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            adj.get(u).add(v);
        }
        ArrayList<Integer> order = new Solution().courseOrder(adj);
        if (order.isEmpty()) {
            System.out.println(-1);
            return;
        }
        StringBuilder line = new StringBuilder();
        for (int i = 0; i < order.size(); i++) {
            if (i > 0) {
                line.append(' ');
            }
            line.append(order.get(i));
        }
        System.out.println(line);
    }
}
```
