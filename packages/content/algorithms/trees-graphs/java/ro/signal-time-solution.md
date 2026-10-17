```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Scanner;

public class Main {
    // vecini.get(u) are perechi {v, cost}: un cablu intre u si v pe care semnalul merge cost minute.
    static int timpSemnal(ArrayList<ArrayList<int[]>> vecini, int s) {
        int[] dist = new int[vecini.size()];
        Arrays.fill(dist, -1);
        dist[s] = 0;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.add(new int[] {0, s});
        while (!heap.isEmpty()) {
            int[] varf = heap.poll();
            int d = varf[0];
            int u = varf[1];
            if (d > dist[u]) {
                continue;
            }
            for (int[] muchie : vecini.get(u)) {
                int v = muchie[0];
                int cost = muchie[1];
                if (dist[v] == -1 || d + cost < dist[v]) {
                    dist[v] = d + cost;
                    heap.add(new int[] {dist[v], v});
                }
            }
        }
        int cel_mai_lent = 0;
        for (int d : dist) {
            if (d == -1) {
                return -1;
            }
            cel_mai_lent = Math.max(cel_mai_lent, d);
        }
        return cel_mai_lent;
    }

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
        System.out.println(timpSemnal(vecini, s));
    }
}
```
