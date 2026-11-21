```java
import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    public static void main(String[] args) throws Exception {
        int[][] shops = { { 10, 20, 5 }, { 8, 25, 4 }, { 12, 15, 9 } };

        ExecutorService pool = Executors.newFixedThreadPool(3);
        ArrayList<Future<Integer>> totals = new ArrayList<>();
        for (int[] prices : shops) {
            totals.add(pool.submit(() -> {
                int sum = 0;
                for (int p : prices) {
                    sum += p;
                }
                return sum;
            }));
        }
        int best = 0;
        int bestTotal = 0;
        for (int i = 0; i < totals.size(); i++) {
            int total = totals.get(i).get();
            System.out.println("Shop " + (i + 1) + ": " + total);
            if (i == 0 || total < bestTotal) {
                best = i;
                bestTotal = total;
            }
        }
        System.out.println("Cheapest: shop " + (best + 1));
        pool.shutdown();
    }
}
```
