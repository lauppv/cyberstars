```java
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    static void dfs(ArrayList<ArrayList<Integer>> vecini, int[] bucata, int u, int b) {
        bucata[u] = b;
        for (int v : vecini.get(u)) {
            if (bucata[v] == 0) {
                dfs(vecini, bucata, v, b);
            }
        }
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

        int[] bucata = new int[n];
        int numar = 0;
        for (int v = 0; v < n; v++) {
            if (bucata[v] == 0) {
                numar++;
                dfs(vecini, bucata, v, numar);
            }
        }

        System.out.println("Bucati: " + numar);
        for (int b = 1; b <= numar; b++) {
            System.out.print("Bucata " + b + ":");
            for (int v = 0; v < n; v++) {
                if (bucata[v] == b) {
                    System.out.print(" " + v);
                }
            }
            System.out.println();
        }
    }
}
```
