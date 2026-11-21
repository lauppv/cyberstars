import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    static int total(int[] prices) {
        int sum = 0;
        for (int p : prices) sum += p;
        return sum;
    }

    public static void main(String[] args) throws Exception {
        int[][] shops = { { 10, 20, 5 }, { 8, 25, 4 }, { 12, 15, 9 } };
        ExecutorService pool = Executors.newFixedThreadPool(3);
        List<Future<Integer>> futures = new ArrayList<>();
        for (int i = 0; i < shops.length; i++) {
            int[] row = shops[i];
            futures.add(pool.submit(() -> total(row)));
        }
        pool.shutdown();
        int cheapest = 1;
        int min = Integer.MAX_VALUE;
        int n = 1;
        for (Future<Integer> f : futures) {
            int t = f.get();
            System.out.println("Shop " + n + ": " + t);
            if (t < min) { min = t; cheapest = n; }
            n++;
        }
        System.out.println("Cheapest: shop " + cheapest);
    }
}
