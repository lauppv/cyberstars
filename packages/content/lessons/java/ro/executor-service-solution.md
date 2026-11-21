```java
import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    public static void main(String[] args) throws Exception {
        int[][] magazine = { { 10, 20, 5 }, { 8, 25, 4 }, { 12, 15, 9 } };

        ExecutorService pool = Executors.newFixedThreadPool(3);
        ArrayList<Future<Integer>> totaluri = new ArrayList<>();
        for (int[] preturi : magazine) {
            totaluri.add(pool.submit(() -> {
                int suma = 0;
                for (int p : preturi) {
                    suma += p;
                }
                return suma;
            }));
        }
        int celMaiBun = 0;
        int totalMinim = 0;
        for (int i = 0; i < totaluri.size(); i++) {
            int total = totaluri.get(i).get();
            System.out.println("Magazinul " + (i + 1) + ": " + total);
            if (i == 0 || total < totalMinim) {
                celMaiBun = i;
                totalMinim = total;
            }
        }
        System.out.println("Cel mai ieftin: magazinul " + (celMaiBun + 1));
        pool.shutdown();
    }
}
```
