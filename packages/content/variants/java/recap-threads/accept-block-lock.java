import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

class Stash {
    private int total, count;

    void add(int amount) {
        synchronized (this) {
            total += amount;
            count++;
        }
    }

    synchronized String summary() { return "Stash: " + total + " from " + count + " hauls"; }
}

public class Main {
    public static void main(String[] args) throws Exception {
        String[] crews = { "Tommy", "Lance", "Ken" };
        int[][] hauls = { { 500, 200 }, { 100 }, { 300, 300, 100 } };
        Stash stash = new Stash();
        ExecutorService pool = Executors.newFixedThreadPool(2);
        List<Future<Integer>> futures = new ArrayList<>();
        for (int i = 0; i < crews.length; i++) {
            int[] jobs = hauls[i];
            futures.add(pool.submit(() -> {
                int sum = 0;
                for (int j = 0; j < jobs.length; j++) { stash.add(jobs[j]); sum += jobs[j]; }
                return sum;
            }));
        }
        int best = -1, bestTotal = -1;
        for (int i = 0; i < futures.size(); i++) {
            int t = futures.get(i).get();
            System.out.println(crews[i] + ": " + t);
            if (t > bestTotal) { bestTotal = t; best = i; }
        }
        pool.shutdown();
        System.out.println(stash.summary());
        System.out.println("Best crew: " + crews[best]);
    }
}
