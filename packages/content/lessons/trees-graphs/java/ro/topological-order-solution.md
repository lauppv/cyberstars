```java
import java.util.ArrayList;
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
        int[] grad = new int[n];
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            vecini.get(u).add(v);
            grad[v]++;
        }

        boolean[] facut = new boolean[n];
        ArrayList<Integer> ordine = new ArrayList<>();
        for (int pas = 0; pas < n; pas++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!facut[v] && grad[v] == 0) {
                    u = v;
                    break;
                }
            }
            if (u == -1) {
                break;
            }
            facut[u] = true;
            ordine.add(u);
            for (int v : vecini.get(u)) {
                grad[v]--;
            }
        }

        if (ordine.size() == n) {
            System.out.print("Ordine:");
            for (int v : ordine) {
                System.out.print(" " + v);
            }
            System.out.println();
        } else {
            System.out.println("Nicio ordine, exista un ciclu");
        }
    }
}
```
