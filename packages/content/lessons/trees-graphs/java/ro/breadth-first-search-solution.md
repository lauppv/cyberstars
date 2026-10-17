```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Queue;
import java.util.Scanner;

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
        int s = scanner.nextInt();
        int t = scanner.nextInt();

        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[s] = 0;
        Queue<Integer> coada = new ArrayDeque<>();
        coada.add(s);
        while (!coada.isEmpty()) {
            int u = coada.poll();
            for (int v : vecini.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    coada.add(v);
                }
            }
        }

        for (int v = 0; v < n; v++) {
            System.out.println(v + ": " + dist[v]);
        }
        if (dist[t] == -1) {
            System.out.println("Niciun drum de la " + s + " la " + t);
        } else {
            System.out.println("Cei mai putini pasi de la " + s + " la " + t + ": " + dist[t]);
        }
    }
}
```
