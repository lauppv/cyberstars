import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;

class Stash {
    AtomicInteger total = new AtomicInteger();
    AtomicInteger count = new AtomicInteger();

    void add(int amount) {
        total.addAndGet(amount);
        count.incrementAndGet();
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        String[] crews = { "Tommy", "Lance", "Ken" };
        int[][] hauls = { { 500, 200 }, { 100 }, { 300, 300, 100 } };

        Stash stash = new Stash();
        ExecutorService pool = Executors.newFixedThreadPool(2);
        ArrayList<Future<Integer>> results = new ArrayList<>();
        for (int[] jobs : hauls) {
            results.add(pool.submit(() -> {
                int mine = 0;
                for (int amount : jobs) {
                    stash.add(amount);
                    mine += amount;
                }
                return mine;
            }));
        }
        int best = 0;
        int bestTotal = 0;
        for (int i = 0; i < crews.length; i++) {
            int total = results.get(i).get();
            System.out.println(crews[i] + ": " + total);
            if (i == 0 || total > bestTotal) {
                best = i;
                bestTotal = total;
            }
        }
        pool.shutdown();
        System.out.println("Stash: " + stash.total + " from " + stash.count + " hauls");
        System.out.println("Best crew: " + crews[best]);
    }
}
