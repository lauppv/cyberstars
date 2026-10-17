```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    static void dfs(ArrayList<ArrayList<int[]>> vecini, int[] bucata, int u, int b) {
        bucata[u] = b;
        for (int[] muchie : vecini.get(u)) {
            if (bucata[muchie[0]] == 0) {
                dfs(vecini, bucata, muchie[0], b);
            }
        }
    }

    static void afiseazaLinie(String eticheta, int[] valori) {
        System.out.print(eticheta);
        for (int valoare : valori) {
            System.out.print(" " + valoare);
        }
        System.out.println();
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

        int[] bucata = new int[n];
        int bucati = 0;
        for (int v = 0; v < n; v++) {
            if (bucata[v] == 0) {
                bucati++;
                dfs(vecini, bucata, v, bucati);
            }
        }

        int[] pasi = new int[n];
        Arrays.fill(pasi, -1);
        pasi[s] = 0;
        Queue<Integer> coada = new ArrayDeque<>();
        coada.add(s);
        while (!coada.isEmpty()) {
            int u = coada.poll();
            for (int[] muchie : vecini.get(u)) {
                int v = muchie[0];
                if (pasi[v] == -1) {
                    pasi[v] = pasi[u] + 1;
                    coada.add(v);
                }
            }
        }

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

        System.out.println("Bucati: " + bucati);
        afiseazaLinie("Pasi:", pasi);
        afiseazaLinie("Distante:", distanta);
    }
}
```
