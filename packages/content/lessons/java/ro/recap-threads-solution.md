```java
import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

class Ascunzatoare {
    int total = 0;
    int numar = 0;

    synchronized void adauga(int suma) {
        total += suma;
        numar++;
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        String[] bande = { "Tommy", "Lance", "Ken" };
        int[][] prazi = { { 500, 200 }, { 100 }, { 300, 300, 100 } };

        Ascunzatoare ascunzatoare = new Ascunzatoare();
        ExecutorService pool = Executors.newFixedThreadPool(2);
        ArrayList<Future<Integer>> rezultate = new ArrayList<>();
        for (int[] treburi : prazi) {
            rezultate.add(pool.submit(() -> {
                int alMeu = 0;
                for (int suma : treburi) {
                    ascunzatoare.adauga(suma);
                    alMeu += suma;
                }
                return alMeu;
            }));
        }
        int celMaiBun = 0;
        int totalMaxim = 0;
        for (int i = 0; i < bande.length; i++) {
            int total = rezultate.get(i).get();
            System.out.println(bande[i] + ": " + total);
            if (i == 0 || total > totalMaxim) {
                celMaiBun = i;
                totalMaxim = total;
            }
        }
        pool.shutdown();
        System.out.println("Ascunzatoare: " + ascunzatoare.total + " din " + ascunzatoare.numar + " prazi");
        System.out.println("Cea mai buna banda: " + bande[celMaiBun]);
    }
}
```
