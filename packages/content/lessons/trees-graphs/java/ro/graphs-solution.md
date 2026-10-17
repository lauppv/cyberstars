```java
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] matrice = new int[n][n];
        ArrayList<ArrayList<Integer>> vecini = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            vecini.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            matrice[u][v] = 1;
            matrice[v][u] = 1;
            vecini.get(u).add(v);
            vecini.get(v).add(u);
        }

        System.out.println("Matrice:");
        for (int u = 0; u < n; u++) {
            for (int v = 0; v < n; v++) {
                System.out.print(matrice[u][v] + " ");
            }
            System.out.println();
        }

        System.out.println("Lista:");
        for (int v = 0; v < n; v++) {
            System.out.print(v + ":");
            for (int urmator : vecini.get(v)) {
                System.out.print(" " + urmator);
            }
            System.out.println();
        }
    }
}
```
