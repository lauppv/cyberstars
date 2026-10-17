```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Scanner;

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

        int[] distanta = new int[n];
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

        for (int v = 0; v < n; v++) {
            System.out.println(v + ": " + distanta[v]);
        }
    }
}
```
