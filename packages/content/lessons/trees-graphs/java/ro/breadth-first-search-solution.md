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

        int[] distanta = new int[n];
        Arrays.fill(distanta, -1);
        distanta[s] = 0;
        Queue<Integer> coada = new ArrayDeque<>();
        coada.add(s);
        while (!coada.isEmpty()) {
            int u = coada.poll();
            for (int v : vecini.get(u)) {
                if (distanta[v] == -1) {
                    distanta[v] = distanta[u] + 1;
                    coada.add(v);
                }
            }
        }

        for (int v = 0; v < n; v++) {
            System.out.println(v + ": " + distanta[v]);
        }
        if (distanta[t] == -1) {
            System.out.println("Niciun drum de la " + s + " la " + t);
        } else {
            System.out.println("Cei mai putini pasi de la " + s + " la " + t + ": " + distanta[t]);
        }
    }
}
```
